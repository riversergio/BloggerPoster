const {google} = require('googleapis');
const blogger = google.blogger('v3');

class PagesController {
    async index(req,res) {
        const blogData = await blogger.blogs.listByUser({ userId: 'self' });
        const blogParseData = blogData.data.items.map((blog,index) => ({
            index: index + 1,
            id: blog.id,
            name: blog.name,
            status: blog.status,
            url: blog.url,
            numPost: blog.posts.totalItems,
            numPage: blog.pages.totalItems,
            published: [blog.published.substring(8, 10), blog.published.substring(5, 7), blog.published.substring(0, 4)].join("/")
        }));
        
        res.render('index',{
            title: "Blogger Poster - DucTranSpot",
            blogs: blogParseData,
            userData: res.locals.userData.data
        });
    }
    async authCallback(req, res) {
        res.redirect('back');
    }
}
module.exports = new PagesController();