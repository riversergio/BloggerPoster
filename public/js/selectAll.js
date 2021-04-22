const selectedPosts = [];
const selectedPages = [];

const selectAllPostsCheckBox = $("#selectAllPosts");
const itemInfoElem = $(".item-info");
const msgElem = $(".item-msg");
const removeItemBtn = $("#removeItems");

const showSelectionInfo = () => {
	if (selectedPosts.length) itemInfoElem.addClass("active");
	else itemInfoElem.removeClass("active");
	itemInfoElem.find(".num").text(selectedPosts.length);
};

const isDuplicate = (arr, value) => {
	return arr.indexOf(value) > -1;
};

const inlinePostSelect = (elem) => {
	const self = $(elem);
	const isChecked = self.prop("checked");
	const postId = self.data("postid");
	if (isChecked && !isDuplicate(selectedPosts, postId))
		selectedPosts.push(postId);
	else {
		selectedPosts.splice(selectedPosts.indexOf(postId), 1);
		selectAllPostsCheckBox.prop("checked", false);
	}
	showSelectionInfo();
};

removeItemBtn.on("click", (e) => {
	e.preventDefault();
	const sureConfirm = confirm(
		"Bạn có chắc muốn xóa " + selectedPosts.length + " bài viết này không ?"
	);
	if (sureConfirm) {
		msgElem.addClass("active");
		$.ajax({
			type: "delete",
			url: "/" + location.href.split("/").slice(3).join("/") + "/delete",
			data: {
				posts: selectedPosts,
			},
			success: function (data) {
				if (data.status === "ok") {
					msgElem.removeClass("active").addClass("active");
					selectedPosts.splice(0, selectedPosts.length);
					showSelectionInfo();
					msgElem
						.removeClass("alert-warning")
						.addClass("alert-success");
					setTimeout(() => {
						msgElem
							.removeClass("alert-success active")
							.addClass("alert-warning");
					}, 1500);
					location.reload();
					msgElem.removeClass("active");
				} else {
					alert("Có lỗi xảy ra, hãy thử lại!");
				}
			},
			error: function (error) {
				console.error(error);
			},
		});
	}
});

selectAllPostsCheckBox.on("change", (e) => {
	e.preventDefault();
	const isChecked = selectAllPostsCheckBox.prop("checked");
	const posts = $("#posts .form-check-input");
	if (isChecked)
		posts.each((i, post) => {
			if (!post.checked) post.click();
		});
	else
		posts.each((i, post) => {
			if (post.checked) post.click();
		});
});
