var tools = {
		book: {
			template: `<div class="book">
				<div class="book-ctrl">
					<div class="book-pagechange"
					@click="pagechange($event)">
						<span data-ctrl="prev">上一页</span>
						<em>第{{ page }}页</em>
						<span data-ctrl="next">下一页</span>
					</div>
					<div class="book-search">
						<input type="text" v-model="searchText" placeholder="🔍 输入作者/书名">
						<button @click="search">查询</button>
					</div>
				</div>

				<ul class="book-power">
					<li v-for="(val, index) in items"
					:class="{vh:!val['bookName']}">
						<div class="li-img">
							<div><img width="40" :src="val.cover" alt=""></div>
							<span class="text-name">{{ val.bookName }}</span>
						</div>
						<div class="li-text">
							<span class="text-auther">作者:{{ val.authorName }}</span>
							<span class="text-sum">库存:{{ val.inventory }}</span>
							<span class="text-task">{{ val.bookTip }}</span>
						</div>
					</li>
				</ul>

			</div>`,
			props: [],
			created: function() {
				this.request()
			},
			data: function() {
				return {
					searchText: "",
					pageSize: 1,
					page: 1,
					items: []
				};
			},
			methods: {
				search: function() {
					var vm = this
					vm.page = 1
					vm.request(vm.searchText, vm.page)
				},
				pagechange: function(e) {
					var vm = this,
						tag = e.target,
						ctrl = tag.dataset["ctrl"],
						pageSize = vm.pageSize,
						page = vm.page
					switch (ctrl) {
						case "prev":
							if (page > 0) {
								page--;
							}
							break;
						case "next":
							if (page < pageSize) {
								page++;
							}
							break;
					}
					if (!vm.searchText) {
						ctrl = "default"
					} else {
						ctrl = vm.searchText
					}
					vm.page = page
					vm.request(ctrl, page)
				},
				request: function(val, page) {
					var vm = this
					if (!page) {
						page = 1
					}
					if (!val) {
						val = "default"
					}
					vm.$http.get("./../static/php/home.php", {
						params: {
							book: val,
							page: page
						}
					}).then(function(data) {
						data = data.data
						vm.items = data.data
						vm.pageSize = Math.ceil(data.count / 12)
					})
				}
			}
		},
		borrow: {
			template: `<div class="borrow">
				<div class="borrow-books">
					<router-view></router-view>
				</div>
				<ul>
					<router-link :to="{path : val.path}" v-for="(val, index) in lists" tag="li" active-class="active">
						<img :src="val.imgName" alt="" class="li-logo">
						<span class="li-tip" :data-info="index">{{ val.tip }}</span>
					</router-link>
				</ul>
			</div>`,
			props: [],
			data: function() {
				return {
					items: [{
						imgName: "book-out.jpg",
						tip: "借阅",
						path: "in"
					}, {
						imgName: "book-in.jpg",
						tip: "借书记录",
						path: "user"
					}]
				};
			},
			methods: {

			},
			computed: {
				lists: function() {
					var vm = this,
						arr;
					arr = vm.items.map(function(val, index) {
						val.imgName = "./../static/img/home/" + val.imgName;
						return val;
					});
					return vm.items;
				}
			}
		},
		manager: {
			template: `<div class="manager">
				<ul class="manager-head">
					<router-link :to="{path : '/manager/user'}" tag="li">用户管理</router-link>
					<router-link :to="{path : '/manager/book'}" tag="li">书架管理</router-link>
					<router-link :to="{path : '/manager/paybook'}" tag="li">书籍管理</router-link>
					<router-link :to="{path : '/manager/log'}" tag="li">借书记录</router-link>
					<router-link :to="{path : '/manager/author'}" tag="li">作者信息</router-link>
				</ul>
				<div class="admonition" v-show="$route.path == '/manager'">
					<div class="admonition-left">
						<h2>厚</h2>
						<h2>德</h2>
						<h2>博</h2>
						<h2>学</h2>
					</div>
					<div class="admonition-right">
						<h2>宽</h2>
						<h2>以</h2>
						<h2>载</h2>
						<h2>物</h2>
					</div>
				</div>

				<div class="manager-content">
					<router-view></router-view>
				</div>
			</div>`
		},
		"borrowed-user": {
			template: `<div class="borrow-user">
				<table border="0" cellspacing="0" cellpadding="0">
					<caption>借书记录</caption>
					<thead>
						<tr>
							<th>借书人</th>
							<th>已借书名</th>
							<th>借书日期</th>
							<th>还书日期</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody>
						<tr
						 v-for="item in items">
							<td>{{ item.userAllName }}</td>
							<td>{{ item.bookName }}</td>
							<td>{{ item.borrowedDate }}</td>
							<td>{{ dealReturnDate(item.returnDate) }}</td>
							<td v-if="item.returnDate == '0000-00-00'">
								<button @click="returnBook(item)">申请还书</button>
							</td>
							<td v-if="item.returnDate == '1970-01-01'">
								<button @click="cancelReturnBook(item)">取消申请</button>
							</td>
							<td v-else></td>
						</tr>
					</tbody>
				</table>
				<div class="page-box">
					<my-page
						:maxlen="maxlen"
						@response="response"
					/>
				</div>
			</div>`,
			created: function() {
				this.request()
			},
			data: function() {
				return {
					items: [],
					page: 1,
					maxlen: 1
				};
			},
			methods: {
				returnBook: function(val) {
					var vm = this
					layer.confirm("确定申请么?", ["yes", "no"], function() {
						vm.$http.post("../static/php/home.php", {
							borrowedInfos: val,
							type: 'confirm',
						}, {
							emulateJSON: true
						}).then(function(data) {
							data = data.data
							if (data.state) {
								layer.msg(data.msg, {
									icon: 1,
									time: 1200
								}, function() {
									vm.request(1)
								});
							} else {
								layer.msg(data.msg, {
									icon: 2,
									time: 1000
								});
							}
						});
					});
				},
				cancelReturnBook: function(val) {
					var vm = this
					layer.confirm("确定取消申请么?", ["yes", "no"], function() {
						vm.$http.post("../static/php/home.php", {
							borrowedInfos: val,
							type: 'cancel',
						}, {
							emulateJSON: true
						}).then(function(data) {
							data = data.data
							if (data.state) {
								layer.msg(data.msg, {
									icon: 1,
									time: 1200
								}, function() {
									vm.request(1)
								});
							} else {
								layer.msg(data.msg, {
									icon: 2,
									time: 1000
								});
							}
						});
					});
				},
				response: function(val) {
					this.page = val
				},
				request: function(page) {
					var vm = this
					if (!page) {
						page = 1
					}
					vm.$http.get("./../static/php/home.php", {
						params: {
							userName: header.userName,
							page: page
						}
					}).then(function(data) {
						data = data.data
						vm.items = data.data
						vm.maxlen = data.count
					})
				},
				dealReturnDate: function(tag) {
					if(tag == "0000-00-00") {
						return ""
					} else if(tag == "1970-01-01") {
						return "申请中..."
					} else {
						return tag
					}
				},
			},
			watch: {
				page: function(val) {
					this.request(val)
				}
			}
		},
		"borrow-user": {
			template: `<div class="book-ctrl">
				<table border="0" cellspacing="0" cellpadding="0">
					<caption>用户借书</caption>
					<thead>
						<tr>
							<th>
								书籍名称
							</th>
							<th>
								作者
							</th>
							<th>
								库存
							</th>
							<th>
								上架时间
							</th>
							<th>
								操作
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(val, index) in items">
							<td>{{val.bookName}}</td>
							<td>{{val.authorName}}</td>
							<td>{{val.inventory}}</td>
							<td>{{val.createTime}}</td>
							<td v-if="val.inventory > 0">
								<a href="javascript:;" @click="action(val)">借阅</a>
							</td>
						</tr>
					</tbody>
				</table>
				<div class="page-box">
					<my-page
						:maxlen="maxlen"
						@response="response"
					/>
				</div>
			</div>`,
			data: function() {
				return {
					items: [],
					maxlen: 1,
					page: 1
				}
			},
			created: function() {
				this.request(1);
			},
			methods: {
				action: function(val) {
					var vm = this;
					var req = layer.open({
						content: "确定借阅此书？",
						btn: ["确定", "取消"],
						yes: function() {
							var obj = {
								userName: header.userName,
								bookName: val.bookName,
								inventory: val.inventory,
								borrowed: val.borrowed,
								id: val.id
							}
							vm.$http.post("./../static/php/home.php", {
								list: obj
							}, {
								emulateJSON: true
							}).then(function(data) {
								data = data.data;
								if (data.state) {
									layer.msg(data.msg, {
										icon: 1,
										time: 1000
									}, function() {
										vm.request(1)
									})
								} else {
									layer.msg(data.msg, {
										icon: 2,
										time: 1200
									})
								}
							}, function(err) {
								layer.msg("系统异常!", {
									icon: 3,
									time: 1200
								})
							});
							layer.close(req)
						}
					});
				},
				response: function(val) {
					this.request(val)
				},
				request: function(page) {
					var vm = this
					if (!page) {
						page = 1
					}
					vm.$http.get("./../static/php/home.php", {
						params: {
							book: "list",
							page: page
						}
					}).then(function(data) {
						data = data.data
						vm.items = data.data
						vm.page = 1
						vm.maxlen = Math.ceil(data.count / 12)
					})
				}
			},
			watch: {
				page: function(val) {
					this.request(val)
				}
			}
		},
		"manager-user": {
			template: `
				<div class="user-list">
					<div class="book-search">
						<input type="text" v-model="searchText" placeholder="🔍 输入用户名或登录账号">
						<button @click="search">查询</button>
					</div>
					<p><button @click="addUser">新增用户</button></p>
					<div class="book-list">
						<table border="0" cellspacing="0" cellpadding="0">
							<caption>
								用户列表
							</caption>
							<thead>
								<tr>
									<th>
										用户名
									</th>
									<th>
										密码
									</th>
									<th>
										用户全名
									</th>
									<th>
										用户说明
									</th>
									<th>
										操作
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(val, index) in items">
									<td>
										{{val.userName}}
									</td>
									<td>
										{{val.password}}
									</td>
									<td>
										{{val.userAllName}}
									</td>
									<td>
										{{val.tast}}
									</td>
									<td>
										<a href="javascript:;" @click="updateInfo(val)">
											修改
										</a>
										<a href="javascript:;" @click="removeUser(val)">
											销户
										</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="update-box" v-show="updateBox" data-info="update" @click="close">
						<form>
							<div>
								<label>用户帐号</label>
								<input type="text" v-model="userName">
							</div>
							<div>
								<label>用户密码</label>
								<input type="password" v-model="pwd">
							</div>
							<div>
								<label>确认密码</label>
								<input type="password" v-model="rePwd">
							</div>
							<div>
								<label>用户全称</label>
								<input type="text" v-model="userAllName">
							</div>
							<div>
								<input type="button" value="更新" @click="submit('update')">
							</div>
						</form>
					</div>
					<div class="add-box" v-show="addBox" data-info="add" @click="close">
						<form>
							<div>
								<label>用户帐号</label>
								<input type="text" v-model="userName">
							</div>
							<div>
								<label>用户密码</label>
								<input type="password" v-model="pwd">
							</div>
							<div>
								<label>确认密码</label>
								<input type="password" v-model="rePwd">
							</div>
							<div>
								<label>用户全称</label>
								<input type="text" v-model="userAllName">
							</div>
							<div>
								<input type="button" value="添加" @click="submit('insert')">
							</div>
						</form>
					</div>
				</div>
			`,
			data: function() {
				return {
					searchText: "",
					items: [],
					updateBox: false,
					addBox: false,
					userName: "",
					pwd: "",
					rePwd: "",
					userAllName: "",
					id: ""
				}
			},
			methods: {
				search: function() {
					var vm = this;
					if (!vm.search) {
						layer.msg("搜索内容，不可为空！", {
							icon: 3,
							time: 1000
						});
						return;
					}
					vm.$http.get("./../static/php/manage.php", {
						params: {
							user: vm.searchText
						}
					}).then(function(data) {
						vm.items = data.data.data;
					});
				},
				addUser: function() {
					var vm = this;
					vm.userName = "";
					vm.pwd = "";
					vm.rePwd = "";
					vm.userAllName = "";
					vm.addBox = true;
				},
				updateInfo: function(val) {
					var vm = this;
					vm.userName = val.userName;
					vm.pwd = val.password;
					vm.rePwd = val.password;
					vm.userAllName = val.userAllName;
					vm.id = val.id;
					vm.updateBox = true;
				},
				removeUser: function(val) {
					var id = val.id,
						vm = this;
					var ly = layer.open({
						content: "确定从系统中移除用户么？",
						btn: ['确定', "取消"],
						yes: function() {
							vm.$http.post("./../static/php/manage.php", {
								id: id,
								type: "delete",
								user: "user"
							}, {
								emulateJSON: true
							}).then(function(data) {
								data = data.data;
								if (data.state == 1) {
									layer.msg(data.msg, {
										icon: 1,
										time: 1000
									}, function() {
										vm.$http.get("./../static/php/manage.php", {
											params: {
												user: "1"
											}
										}).then(function(data) {
											vm.items = data.data.data;
										});
									});
								} else {
									layer.msg(data.msg, {
										icon: 2,
										time: 1000
									});
								}

							});
							layer.close(ly);
						}
					})
				},
				close: function(e) {
					var target = e.target,
						dataset = target.dataset['info'],
						vm = this;
					switch (dataset) {
						case "add":
							vm.addBox = false;
							break;
						case "update":
							vm.updateBox = false;
							break;
						default:
							return;
					}
				},
				submit: function(type) {
					var vm = this,
						id = vm.id;
					if (!id) {
						id = "0";
					}
					vm.$http.post("./../static/php/manage.php", {
						id: id,
						type: type,
						user: {
							userName: vm.userName,
							password: vm.pwd,
							userAllName: vm.userAllName
						}
					}, {
						emulateJSON: true
					}).then(function(data) {
						data = data.data;
						if (data.state == 1) {
							layer.msg(data.msg, {
								icon: 1,
								time: 1000
							}, function() {
								// 重新请求数据
								vm.$http.get("./../static/php/manage.php", {
									params: {
										user: "1"
									}
								}).then(function(data) {
									vm.items = data.data.data;
									vm.updateBox = false;
									vm.addBox = false;
								});
							});
						} else {
							layer.msg(data.msg, {
								icon: 2,
								time: 1000
							});
						}
					}, function(err) {
						layer.msg("数据请求失败!", {
							icon: 3,
							time: 1000
						});
					});
				}
			},
			created: function() {
				var vm = this;
				vm.$http.get("./../static/php/manage.php", {
					params: {
						user: "1"
					}
				}).then(function(data) {
					vm.items = data.data.data;
				});
			}
		},
		// 书架管理
		"manager-book": {
			template: `
				<div class="manager-book">
					<div class="book-search">
						<input type="text" v-model="searchText" placeholder="🔍 输入作者/书名">
						<button @click="search">查询</button>
					</div>
					<p><button @click="addBooks">书籍上架</button></p>
					<div class="book-list">
						<table border="0" cellspacing="0" cellpadding="0">
							<caption>
								书架书籍
							</caption>
							<thead>
								<tr>
									<th>
										图书名称
									</th>
									<th>
										作者姓名
									</th>
									<th>
										上架时间
									</th>
									<th>
										书籍说明
									</th>
									<th>
										库存
									</th>
									<th>
										借出
									</th>
									<th>
										操作
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(val, index) in items">
									<td>
										{{val.bookName}}
									</td>
									<td>
										{{val.authorName}}
									</td>
									<td>
										{{val.createTime}}
									</td>
									<td>
										{{val.bookTip}}
									</td>
									<td>
										{{val.inventory}}
									</td>
									<td>
										{{val.borrowed}}
									</td>
									<td>
										<a href="javascript:;" @click="updateInfo(val)">
											修改
										</a>
										<a href="javascript:;" @click="removeBook(val)">
											下架
										</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="update-box" v-show="updateBox" data-info="update" @click="close">
						<form>
							<div>
								<label>书籍说明</label>
								<textarea cols="30" rows="6" v-model="bookTip"></textarea>
							</div>
							<div>
								<label>库存数量</label>
								<input type="text" v-model="inventory">
							</div>
							<div>
								<label>借出数量</label>
								<input type="text" v-model="borrowed">
							</div>
							<div>
								<input type="button" value="更新" @click="submit('update')">
							</div>
						</form>
					</div>
					<div class="add-box" v-show="addBox" data-info="add" @click="close">
						<form>
							<div>
								<label>书籍名称</label>
								<input type="text" v-model="bookName">
							</div>
							<div>
								<label>入库数量</label>
								<input type="text" v-model="inventory">
							</div>
							<div>
								<label>借出数量</label>
								<input type="text" v-model="borrowed">
							</div>
							<div>
								<input type="button" value="添加" @click="submit('insert')">
							</div>
						</form>
					</div>
					<div class="page-box">
						<my-page
							:maxlen="maxlen"
							@response="response"
						/>
					</div>
				</div>
			`,
			data: function() {
				return {
					searchText: "",
					items: [],
					updateBox: false,
					addBox: false,
					bookName: "",
					authorName: "",
					bookTip: "",
					inventory: "",
					borrowed: "",
					id: "",
					page: 1,
					maxlen: 1
				}
			},
			methods: {
				search: function() {
					this.request(1, this.searchText)
				},
				addBooks: function() {
					var vm = this;
					vm.authorName = "";
					vm.bookName = "";
					vm.bookTip = "";
					vm.inventory = "";
					vm.borrowed = "";
					vm.addBox = true;
				},
				updateInfo: function(val) {
					var vm = this;
					vm.authorName = val.authorName;
					vm.bookName = val.bookName;
					vm.bookTip = val.bookTip;
					vm.inventory = val.inventory;
					vm.borrowed = val.borrowed;
					vm.id = val.id;
					vm.updateBox = true;
				},
				removeBook: function(val) {
					var id = val.id,
						vm = this;
					var ly = layer.open({
						content: "确定从系统中下架<strong>《" + val.bookName + "》</strong>么？",
						btn: ['确定', "取消"],
						yes: function() {
							vm.$http.post("./../static/php/manage.php", {
								id: id,
								type: "delete",
								book: "book"
							}, {
								emulateJSON: true
							}).then(function(data) {
								data = data.data;
								if (data.state == 1) {
									layer.msg(data.msg, {
										icon: 1,
										time: 1000
									}, function() {

										vm.updateBox = false;
										vm.addBox = false;
									});
								} else {
									layer.msg(data.msg, {
										icon: 2,
										time: 1000
									});
								}

							});
							layer.close(ly);
						}
					})
				},
				close: function(e) {
					var target = e.target,
						dataset = target.dataset['info'],
						vm = this;
					switch (dataset) {
						case "add":
							vm.addBox = false;
							break;
						case "update":
							vm.updateBox = false;
							break;
						default:
							return;
					}
				},
				submit: function(type) {
					var vm = this,
						id = vm.id,
						val = vm.searchText
					if (!id) {
						id = "0";
					}
					vm.$http.post("./../static/php/manage.php", {
						id: id,
						type: type,
						book: {
							authorName: vm.authorName,
							bookName: vm.bookName,
							bookTip: vm.bookTip,
							inventory: vm.inventory,
							borrowed: vm.borrowed
						}
					}, {
						emulateJSON: true
					}).then(function(data) {
						data = data.data;
						if (data.state == 1) {
							layer.msg(data.msg, {
								icon: 1,
								time: 1000
							}, function() {
								// 重新请求数据
								vm.request(1, val)
								vm.updateBox = false;
								vm.addBox = false;
							});
						} else {
							layer.msg(data.msg, {
								icon: 2,
								time: 1000
							});
						}
					}, function(err) {
						layer.msg("数据请求失败!", {
							icon: 3,
							time: 1000
						});
					});
				},
				request: function(page, val) {
					var vm = this
					if (!page) {
						page = 1
					}
					if (!val) {
						val = "*"
					}
					vm.$http.get("./../static/php/manage.php", {
						params: {
							book: val,
							page: page
						}
					}).then(function(data) {
						data = data.data
						vm.items = data.data
						vm.maxlen = Math.ceil(data.count / 12)
					})
				},
				response: function(val) {
					this.page = val
				}
			},
			watch: {
				page: function(val) {
					var vm = this,
						str = vm.searchText
					vm.request(val, str)
				}
			},
			created: function() {
				this.request()
			}
		},
		"manager-borrowedLog": {
			template: `
				<div class="borrowed-log">
					<div class="book-search">
						<input type="text" v-model="searchText" placeholder="🔍 输入用户名或登录账号">
						<button @click="search">查询</button>
					</div>
					<div class="book-list">
						<table border="0" cellspacing="0" cellpadding="0">
							<caption>
								用户列表
							</caption>
							<thead>
								<tr>
									<th>
										借书人帐号
									</th>
									<th>
										借书人名称
									</th>
									<th>
										借书书籍名
									</th>
									<th>
										借书日期
									</th>
									<th>
										还书日期
									</th>
									<th>
										状态
									</th>
									<th>
										操作
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(val, index) in items">
									<td>
										{{val.userName}}
									</td>
									<td>
										{{val.userAllName}}
									</td>
									<td>
										{{val.bookName}}
									</td>
									<td>
										{{val.borrowedDate}}
									</td>
									<td>
										{{dealReturnDate(val.returnDate) }}
									</td>
									<td>
										<span v-if="parseInt(val.returnDate) < 1">借阅中</span>
										<span>
										<span v-if="val.returnDate == '1970-01-01'">申请还书</span>
										<span>
										<span v-else>已还</span>
									</td>
									<td>
										<button
										@click="ctrl(val.id, 'update', '申请通过')"
										v-if="val.returnDate == '1970-01-01'">
											申请通过
										</button>
										
										<button @click="ctrl(val.id, 'delete', '删除记录')">
											删除记录
										</button>
										
									</td>
								</tr>
							</tbody>
						</table>
					<div class="page-box">
						<my-page
							:maxlen="maxlen"
							@response="response"
						/>
					</div>
					</div>
				</div>
			`,
			data: function() {
				return {
					searchText: "",
					items: [],
					page: 1,
					maxlen: 1
				}
			},
			methods: {
				search: function() {
					this.request(this.searchText, 1)
				},
				ctrl: function(id, type, tip) {
					var vm = this,
						ly,
						val = vm.searchText;
					ly = layer.open({
						content: "确定要" + tip + "?",
						btn: ["确定", "取消"],
						yes: function() {
							vm.$http.post('./../static/php/manage.php', {
								id: id,
								type: type,
								borrowedInfo: "*"
							}, {
								emulateJSON: true
							}).then(function(data) {
								data = data.data;
								if (data.state == 1) {
									layer.msg(data.msg, {
										icon: 1,
										time: 1000
									}, function() {
										vm.request(1, val)
									})
								} else {
									layer.msg(data.msg, {
										icon: 2,
										time: 1000
									});
								}
								layer.close(ly);
							});
						}
					})

				},
				dealReturnDate: function(tag) {
					if(tag == "0000-00-00") {
						return "未归还"
					} else if(tag == "1970-01-01") {
						return "申请还书"
					} else {
						return "已还"
					}
				},
				request: function(page, val) {
					var vm = this
					if (!page) {
						page = 1
					}
					if (!val) {
						val = "*"
					}
					vm.$http.get("./../static/php/manage.php", {
						params: {
							borrowedInfo: val,
							page: page
						}
					}).then(function(data) {
						data = data.data
						vm.items = data.data
						vm.maxlen = Math.ceil(data.count / 12)
					})
				},
				response: function(val) {
					this.page = val
				}
			},
			watch: {
				page: function(val) {
					var vm = this,
						str = vm.searchText
					vm.request(val, str)
				}
			},
			created: function() {
				this.request()
			}
		},
		"manager-author": {
			template: `
				<div class="author-info">
					<div class="book-search">
						<input type="text" v-model="searchText" placeholder="🔍 输入作者姓名">
						<button @click="search">查询</button>
					</div>
					<p><button @click="addAuthor">新增作者</button></p>
					<div class="book-list">
						<table border="0" cellspacing="0" cellpadding="0">
							<caption>
								作者列表
							</caption>
							<thead>
								<tr>
									<th>
										作者姓名
									</th>
									<th>
										说明
									</th>
									<th>
										操作
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(val, index) in items">
									<td>
										{{val.authorName}}
									</td>
									<td>
										{{val.authorAdage}}
									</td>
									<td>
										<a href="javascript:;" @click="updateInfo(val)">
											修改信息
										</a>
										<a href="javascript:;" @click="removeAuthor(val)">
											删除记录
										</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="update-box" v-show="updateBox" data-info="update" @click="close">
						<form>
							<div>
								<label>作者姓名</label>
								<input type="text" v-model="authorName">
							</div>
							<div>
								<label>个人说明</label>
								<textarea cols="30" rows="10" v-model="authorAdage"></textarea>
							</div>
							<div>
								<input type="button" value="更新" @click="submit('update')">
							</div>
						</form>
					</div>
					<div class="add-box" v-show="addBox" data-info="add" @click="close">
						<form>
							<div>
								<label>作者姓名</label>
								<input type="text" v-model="authorName">
							</div>
							<div>
								<label>个人说明</label>
								<textarea cols="30" rows="10" v-model="authorAdage"></textarea>
							</div>
							<div>
								<input type="button" value="添加" @click="submit('insert')">
							</div>
						</form>
					</div>
				</div>
			`,
			data: function() {
				return {
					searchText: "",
					items: [],
					updateBox: false,
					addBox: false,
					authorName: "",
					authorAdage: "",
					id: ""
				}
			},
			methods: {
				search: function() {
					var vm = this;
					vm.$http.get('./../static/php/manage.php', {
						params: {
							author: vm.searchText
						}
					}).then(function(data) {
						vm.items = data.data.data;
					});
				},
				addAuthor: function() {
					var vm = this;
					vm.authorName = "";
					vm.authorAdage = "";
					vm.addBox = true;
				},
				updateInfo: function(val) {
					var vm = this;
					vm.authorName = val.authorName;
					vm.authorAdage = val.authorAdage;
					vm.id = val.id;
					vm.updateBox = true;
				},
				removeAuthor: function(val) {
					var id = val.id,
						vm = this;
					var ly = layer.open({
						content: "确定从系统中移除作者么？",
						btn: ['确定', "取消"],
						yes: function() {
							vm.$http.post("./../static/php/manage.php", {
								id: id,
								type: "delete",
								author: "author"
							}, {
								emulateJSON: true
							}).then(function(data) {
								data = data.data;
								if (data.state == 1) {
									layer.msg(data.msg, {
										icon: 1,
										time: 1000
									}, function() {
										vm.$http.get("./../static/php/manage.php", {
											params: {
												author: "*"
											}
										}).then(function(data) {
											vm.items = data.data.data;
											vm.updateBox = false;
											vm.addBox = false;
										});
									});
								} else {
									layer.msg(data.msg, {
										icon: 2,
										time: 1000
									});
								}

							});
							layer.close(ly);
						}
					})
				},
				close: function(e) {
					var target = e.target,
						dataset = target.dataset['info'],
						vm = this;
					switch (dataset) {
						case "add":
							vm.addBox = false;
							break;
						case "update":
							vm.updateBox = false;
							break;
						default:
							return;
					}
				},
				submit: function(type) {
					var vm = this,
						id = vm.id;
					if (!id) {
						id = "0";
					}
					vm.$http.post("./../static/php/manage.php", {
						id: id,
						type: type,
						author: {
							authorName: vm.authorName,
							authorAdage: vm.authorAdage,
						}
					}, {
						emulateJSON: true
					}).then(function(data) {
						data = data.data;
						if (data.state == 1) {
							layer.msg(data.msg, {
								icon: 1,
								time: 1000
							}, function() {
								// 重新请求数据
								vm.$http.get("./../static/php/manage.php", {
									params: {
										author: "*"
									}
								}).then(function(data) {
									vm.items = data.data.data;
									vm.updateBox = false;
									vm.addBox = false;
								});
							});
						} else {
							layer.msg(data.msg, {
								icon: 2,
								time: 1000
							});
						}
					}, function(err) {
						layer.msg("数据请求失败!", {
							icon: 3,
							time: 1000
						});
					});
				}
			},
			created: function() {
				var vm = this;
				vm.$http.get('./../static/php/manage.php', {
					params: {
						author: "*"
					}
				}).then(function(data) {
					vm.items = data.data.data;
				})
			}
		},
		// 书籍管理
		"bookmanage": {
			template: `
				<div class="manager-book">
					<div class="book-search">
						<input type="text" v-model="searchText" placeholder="🔍 输入作者/书名">
						<button @click="search">查询</button>
					</div>
					<p><button @click="addBook">购进新书</button></p>
					<div class="book-list">
						<table border="0" cellspacing="0" cellpadding="0">
							<caption>
								库存书籍
							</caption>
							<thead>
								<tr>
									<th>
										图书名称
									</th>
									<th>
										作者姓名
									</th>
									<th>
										购书时间
									</th>
									<th>
										书籍说明
									</th>
									<th>
										操作
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(val, index) in items">
									<td>
										{{val.bookName}}
									</td>
									<td>
										{{val.authorName}}
									</td>
									<td>
										{{val.payDate}}
									</td>
									<td>
										{{val.bookTip}}
									</td>
									<td>
										<a href="javascript:;" @click="updateInfo(val)">
											修改
										</a>
										<a href="javascript:;" @click="removeBook(val)">
											出售
										</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="update-box" v-show="updateBox" data-info="update" @click="close">
						<form>
							<div>
								<label>书籍说明</label>
								<textarea cols="30" rows="6" v-model="bookTip"></textarea>
							</div>
							<div>
								<label>书籍封面</label>
								<input type="file" @change="addFile" placeholder="封面图片大小不超过60kb">
								<img :src="cover" width="30" alt="">
							</div>
							<div>
								<input type="button" value="更新" @click="submit('update')">
							</div>
						</form>
					</div>
					<div class="add-box" v-show="addBox" data-info="add" @click="close">
						<form>
							<div>
								<label>书籍名称</label>
								<input type="text" v-model="bookName">
							</div>
							<div>
								<label>作者姓名</label>
								<input type="text" v-model="authorName">
							</div>
							<div>
								<label>书籍说明</label>
								<textarea cols="30" rows="6" v-model="bookTip"></textarea>
							</div>
							<div>
								<label>书籍封面</label>
								<input type="file" @change="addFile" placeholder="封面图片大小不超过60kb">
								<img :src="cover" width="30" alt="">
							</div>
							<div>
								<input type="button" value="购进" @click="submit('add')">
							</div>
						</form>
					</div>
					<div class="page-box">
						<my-page
							:maxlen="maxlen"
							@response="response"
						/>
					</div>
				</div>
			`,
			data: function() {
				return {
					searchText: "",
					items: [],
					updateBox: false,
					addBox: false,
					bookName: "",
					authorName: "",
					bookTip: "",
					id: "",
					page: 1,
					maxlen: 1,
					cover: "",
				}
			},
			methods: {
				search: function() {
					this.request(1, this.searchText)
				},
				addBook: function() {
					var vm = this;
					vm.cover = ""
					vm.authorName = ""
					vm.bookName = ""
					vm.bookTip = ""
					vm.addBox = true
				},
				addFile: function(e) {
					var cover = e.target.files[0],
						vm = this,
						reader = new FileReader()

					if (cover.size > 60000) {
						layer.msg("图片过大", {
							time: 2000
						})
						return
					}
					reader.readAsDataURL(cover)
					reader.onload = function() {
						vm.cover = reader.result
					}
				},
				updateInfo: function(val) {
					var vm = this
					vm.cover = ""
					vm.authorName = val.authorName
					vm.bookName = val.bookName
					vm.bookTip = val.bookTip
					vm.id = val.id
					vm.updateBox = true
				},
				removeBook: function(val) {
					var id = val.id,
						vm = this,
						val = vm.searchText
					var ly = layer.open({
						content: "确定出售<strong>《" + val.bookName + "》</strong>么？",
						btn: ['确定', "取消"],
						yes: function() {
							vm.$http.post("./../static/php/manage.php", {
								id: id,
								type: "delete",
								bookmanage: "book"
							}, {
								emulateJSON: true
							}).then(function(data) {
								data = data.data;
								if (data.state == 1) {
									layer.msg(data.msg, {
										icon: 1,
										time: 1000
									}, function() {
										vm.request(1, val)
										vm.updateBox = false;
										vm.addBox = false;
									});
								} else {
									layer.msg(data.msg, {
										icon: 2,
										time: 1000
									});
								}

							});
							layer.close(ly);
						}
					})
				},
				close: function(e) {
					var target = e.target,
						dataset = target.dataset['info'],
						vm = this;
					switch (dataset) {
						case "add":
							vm.addBox = false;
							break;
						case "update":
							vm.updateBox = false;
							break;
						default:
							return;
					}
				},
				submit: function(type) {
					var vm = this,
						id = vm.id,
						val = vm.searchText
					if (!id) {
						id = "0";
					}
					vm.$http.post("./../static/php/manage.php", {
						id: id,
						type: type,
						bookmanage: {
							authorName: vm.authorName,
							bookName: vm.bookName,
							bookTip: vm.bookTip,
							cover: vm.cover,
						}
					}, {
						emulateJSON: true
					}).then(function(data) {
						data = data.data;
						if (data.state == 1) {
							layer.msg(data.msg, {
								icon: 1,
								time: 1000
							}, function() {
								// 重新请求数据
								vm.request(1, val)
								vm.updateBox = false;
								vm.addBox = false;
							});
						} else {
							layer.msg(data.msg, {
								icon: 2,
								time: 1000
							});
						}
					}, function(err) {
						layer.msg("数据请求失败!", {
							icon: 3,
							time: 1000
						});
					});
				},
				request: function(page, val) {
					var vm = this
					if (!page) {
						page = 1
					}
					if (!val) {
						val = "*"
					}
					vm.$http.get("./../static/php/manage.php", {
						params: {
							bookmanage: val,
							page: page
						}
					}).then(function(data) {
						data = data.data
						vm.items = data.data
						vm.maxlen = Math.ceil(data.count / 12)
					})
				},
				response: function(val) {
					this.page = val
				}
			},
			watch: {
				page: function(val) {
					var vm = this,
						str = vm.searchText
					vm.request(val, str)
				}
			},
			created: function() {
				this.request()
			}
		},
		// 翻页组件
		"pagechange": {
			template: `<div class="book-pagechange"
					@click="pageChange">
						<span data-ctrl="prev">上一页</span>
						<em>第{{ page }}页</em>
						<span data-ctrl="next">下一页</span>
					</div>`,
			props: ['maxlen'],
			data: function() {
				return {
					page: 1
				}
			},
			methods: {
				pageChange: function(e) {
					var vm = this,
						tag = e.target,
						ctrl = tag.dataset["ctrl"],
						page = vm.page,
						len = vm.maxlen
					switch (ctrl) {
						case "prev":
							if (page > 1) {
								page--
							}
							break
						case "next":
							if (page < len) {
								page++
							}
							break
					}
					vm.page = page
				}
			},
			watch: {
				page: function(val) {
					this.$emit("response", val)
				}
			}
		}
	},
	request = {
		setUserName: function(val) {
			if (typeof(val) == "string") {
				sessionStorage.userName = val;
			} else if (val != "") {
				sessionStorage.userName = val.toString();
			} else {
				sessionStorage.userName = null;
			}
		},
		getUserName: function() {
			if (sessionStorage.userName) {
				return sessionStorage.userName;
			} else {
				return "freeUser";
			}
		},
		setUserType: function(val) {
			if (typeof(val) == "string") {
				sessionStorage.userType = val;
			} else if (val != "") {
				sessionStorage.userType = val.toString();
			} else {
				sessionStorage.userType = null;
			}
		},
		getUserType: function() {
			if (sessionStorage.userType) {
				return sessionStorage.userType;
			} else {
				return "0";
			}
		},
		setUserAllName: function(val) {
			if (typeof(val) == "string") {
				sessionStorage.userAllName = val;
			} else if (val != "") {
				sessionStorage.userAllName = val.toString();
			} else {
				sessionStorage.userAllName = null;
			}
		},
		getUserAllName: function() {
			if (sessionStorage.userAllName) {
				return sessionStorage.userAllName;
			} else {
				return "游客";
			}
		}
	}
// 注册全局组件
Vue.component("my-page", tools.pagechange)