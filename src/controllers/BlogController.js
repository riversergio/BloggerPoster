const { google } = require("googleapis");
const he = require("he");
const { oauth2Client } = require("../middlewares/auth");
const blogger = google.blogger("v3");
const gplay = require('google-play-scraper');
const url = require('url');

class BlogController {
	// [Home]
	index(req, res) {
		res.redirect("/");
	}

	// [:blogId]/items
	async blog(req, res) {
		// Required Data
		const blogId = req.params.blogId;
		const access_token = req.cookies.user;
		const { page } = req.query;
		// Request options
		const postRequestOption = {
			blogId,
			access_token,
			fetchImages: true,
			maxResults: 10,
		};
		if (page) postRequestOption.pageToken = page;
		// Get posts
		const blogData = await blogger.blogs.get({ blogId });
		const postData = await blogger.posts.list(postRequestOption);
		const userData = res.locals.userData.data;
		// Render options
		const renderOptions = {
			userData,
			blogId,
			title: "Đang chỉnh sửa blog: " + blogData.data.name,
			next:
				"nextPageToken" in postData.data
					? postData.data.nextPageToken
					: undefined,
			blog: {
				title: blogData.data.name,
				description: blogData.data.description,
				url: blogData.data.url,
			},
			posts:
				"items" in postData.data
					? postData.data.items.map((post, index) => ({
						id: post.id,
						index: index + 1,
						title: /<\s*(\w+)[^>]*>(.*?)<\s*\/\s*(\1)>/g.exec(
							post.title
						)
							? post.title.replace(
								/<\s*(\w+)[^>]*>(.*?)<\s*\/\s*(\1)>/g,
								"$2"
							)
							: he.decode(post.title),
						thumbnail:
							"images" in post && post.images.length
								? post.images[0].url.indexOf("ytimg") > -1
									? post.images[0].url.replace(
										"hqdefault",
										"maxresdefault"
									)
									: post.images[0].url.replace(
										/\/s[0-9]+(\-c)?\//g,
										"/s100/"
									)
								: "https://1.bp.blogspot.com/-NgCak-F7GQU/Vy4QBjzY2kI/AAAAAAAAAMA/Eud4LcTJG10ESDW86HQ67Jr4w4BmDRMoQCK4B/s480/no-image.jpg",
						author: post.author,
						published: [
							post.published.substring(8, 10),
							post.published.substring(5, 7),
							post.published.substring(0, 4),
						].join("/"),
						url: post.url,
						labels: post.labels,
					}))
					: [],
			scripts: ["postPagination", "selectAll"],
		};
		// Render
		res.render("itemLists", renderOptions);
	}

	async removePost(req, res) {
		const blogId = req.params.blogId;
		const selectedPostsId = req.body.posts;
		let count = 0;
		selectedPostsId.forEach(async (postId, index) => {
			try {
				blogger.posts.delete({
					postId,
					blogId,
				}).then(() => {
					count++;
					if (count === selectedPostsId.length)
						res.json({ status: 'ok' });
				}).catch(err => res.json({ err }));
			} catch (e) {
				res.json({ status: "error" });
			}
		});
	}

	// [POST] :blogId/post/create/execute
	async postCreateApp(req, res) {
		const blogId = req.params.blogId;
		const requestBody = req.body;
		const token = req.cookies.user;
		oauth2Client.setCredentials({
			access_token: token
		});
		try {
			const postData = await blogger.posts.insert({
				blogId,
				requestBody
			});
			if (postData.data)
				res.json(postData.data);
		} catch (err) {
			return res.status(400).json({ err });
		}
	}


	// [GET] :blogId/post/appLeechCH
	async leechCH(req, res) {
		try {
			const chPlayUrl = req.query.url;
			const parsedUrl = url.parse(chPlayUrl, true);
			if (!parsedUrl.query.id)
				res.json({
					msg: 'App id is required'
				})
			else {
				const app = await gplay.app({
					appId: parsedUrl.query.id,
					country: parsedUrl.query.gl || 'US',
					lang: parsedUrl.query.hl || 'vi'
				});
				res.json(app);
			}
		} catch (e) {
			res.json({ e });
		}
	}

	// [GET] :blogId/post/create/
	getCreateApp(req, res) {
		const userData = res.locals.userData.data;
		res.render('postCreate', {
			userData,
			title: 'Tạo bài viết mới',
			styles: ['codemirror', '../theme/eclipse', 'simplescrollbars'],
			scripts: ['lib/codemirror',
				'addon/scroll/simplescrollbars',
				'lib/util/formatting',
				'mode/xml/xml',
				'mode/htmlmixed/htmlmixed',
				'mode/css/css',
				'itemCodeHandler',
				'leech'
			]
		})
	}

	// [GET] :blogId/post/:postId/edit
	async post(req, res) {
		// Slugs
		const blogId = req.params.blogId;
		const postId = req.params.postId;
		// Data
		const blogData = await blogger.blogs.get({ blogId });
		const userData = res.locals.userData.data;
		// Request options
		const requestOptions = {
			method: "GET",
			url: "feeds/posts/default/" + postId,
			baseUrl: blogData.data.url,
			params: {
				alt: "json",
			},
		};
		// Request
		const postData = await oauth2Client.request(requestOptions);
		const postParse = postData.data.entry;
		res.render("postEdit", {
			userData,
			title: postParse.title.$t,
			app: {
				image:
					"media$thumbnail" in postParse
						? postParse.media$thumbnail.url.indexOf(
							"img.youtube.com"
						) > -1
							? postParse.media$thumbnail.url.replace(
								"default",
								"maxresdefault"
							)
							: postParse.media$thumbnail.url.replace(
								/\/s[0-9]+(\-c)?\//g,
								"/s100/"
							)
						: "https://1.bp.blogspot.com/-NgCak-F7GQU/Vy4QBjzY2kI/AAAAAAAAAMA/Eud4LcTJG10ESDW86HQ67Jr4w4BmDRMoQCK4B/s480/no-image.jpg",
				title: postParse.title.$t,
				published: [
					postParse.published.$t.substring(8, 10),
					postParse.published.$t.substring(5, 7),
					postParse.published.$t.substring(0, 4),
				].join("/"),
				content: postParse.content.$t,
			},
			styles: ['codemirror', '../theme/eclipse', 'simplescrollbars'],
			scripts: ['/lib/codemirror',
				'/addon/scroll/simplescrollbars',
				'/lib/util/formatting',
				'/mode/xml/xml',
				'/mode/htmlmixed/htmlmixed',
				'/mode/css/css',
				'itemCodeHandler']
		});
	}

	// [GET] :blogId/page/:pageId/edit
	async page(req, res) {
		// Slugs
		const blogId = req.params.blogId;
		const pageId = req.params.pageId;
		// Data
		const blogData = await blogger.blogs.get({ blogId });
		const userData = res.locals.userData.data;
		// Request options
		const requestOptions = {
			method: "GET",
			url: "feeds/pages/default/" + pageId,
			baseUrl: blogData.data.url,
			params: {
				alt: "json",
			},
		};
		// Request
		const pageData = await oauth2Client.request(requestOptions);
		const pageParse = pageData.data.entry;
		res.render("pageEdit", {
			userData,
			title: pageParse.title.$t,
			app: {
				title: pageParse.title.$t,
				published: [
					pageParse.published.$t.substring(8, 10),
					pageParse.published.$t.substring(5, 7),
					pageParse.published.$t.substring(0, 4),
				].join("/"),
				content: pageParse.content.$t,
			},
		});
	}
}
module.exports = new BlogController();
