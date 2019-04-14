var router = new VueRouter({
	// mode : "history",
	routes: [{
		path: "/book",
		component: tools.book
	}, {
		path: "/borrow",
		component: tools.borrow,
		children: [{
			path: "/borrow",
			redirect: "/borrow/user"
		}, {
			path: "in",
			component: tools["borrow-user"]
		}, {
			path: "user",
			component: tools["borrowed-user"]
		}]
	}, {
		path: "/manager",
		component: tools.manager,
		children: [{
			path: "user",
			component: tools["manager-user"]
		}, {
			path: "book",
			component: tools["manager-book"]
		}, {
			path: "log",
			component: tools["manager-borrowedLog"]
		}, {
			path: "author",
			component: tools["manager-author"]
		}, {
			path: "paybook",
			component: tools["bookmanage"]
		}]

	}, {
		path: "/",
		redirect: "/book"
	}]
})