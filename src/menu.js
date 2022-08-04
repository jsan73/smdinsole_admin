/*
 * 항목설명
 * menuId : menuID
 * parentId : menuID, 권한 시스템에서 메뉴에 대한 FuncID로 할당되어 권한 체크 대상이 됨.
 * menuName : 메뉴 한글명
 * icon : 메뉴 아이콘
 * pagePath : 해당 메뉴의 페이지 위치(물리적 위치)
 * componentName : 해당 메뉴의 vue 파일명(.Vue 제외)
 * url : router url
 * popup : popup 여부
 * meta : authority 가 true면 해당 메뉴는 권한처리 대상이 됨. (권한 여부는 별도 설정). 권한이 있어야 해당 메뉴가 보임.
 * gnbView : popup 이 true 일 경우 gnb 메뉴에 노출 할지 여부
 * popupOption: popup 창의 width, height 값 정의
 * bundle : popup 이고 메뉴가 부모자식간이 아니지만 router 등록이 같이 되야 하는 메뉴를 묶기 위한 값
*/

var menu = [
	// { menuId: "Root", parentId: 0, menuName: "메인", icon: "description", url:"/", redirect:"/device/dashboard" },
	{ menuId: "Main", parentId: 0, menuName: "대시보드", icon: "description", componentName: "Dashboard", pagePath:"views/dashboard", url: "/", meta: { footer:true }},
	{ menuId: "User", parentId: 0, menuName: "사용자 관리", icon: "description", componentName: "UserManager", pagePath:"views/user", url: "/user", meta: {logout:true} },
	{ menuId: "Device", parentId: 0, menuName: "기기 관리", icon: "description", componentName: "DeviceManager", pagePath:"views/device",url: "/device" },
	{ menuId: "Org", parentId: 0, menuName: "기관 관리", icon: "description", componentName: "OrgManager", pagePath:"views/org",url: "/org" },
	{ menuId: "Login", parentId: 0, menuName: "로그인", icon: "description",pagePath: "views/login",  componentName: "Login", url: "/login", meta: { layout: 'Main' }},
	{ menuId: "DeviceAdd", parentId: 0, menuName: "기기 등록", icon: "description",pagePath: "views/device",  componentName: "DeviceAdd", url: "/deviceadd", meta: { layout: 'Popup' }, popup:false},
	{ menuId: "OganiAdd", parentId: 0, menuName: "기기 등록", icon: "description",pagePath: "views/ogni",  componentName: "OganiAdd", url: "/oganiadd", meta: { layout: 'Main' }, popup:false},

	// // { menuId: "MN70", parentId: 0, menuName: "콜팝업", icon: "description", pagePath: "views/ui/temp", componentName: "CallPopup", url: "/ui/callpopup", popup: true, meta: { layout: 'Popup' }, tempmenu: "temp" },
	// // { menuId: "MN70", parentId: 0, menuName: "콜팝업", icon: "description", pagePath: "views/ui/temp", componentName: "CallPopup", url: "/ui/callpopup", popup: true, meta: { layout: 'Popup' }, tempmenu: "temp" },
	//
	// /* 상담 */
	// { menuId: "cnsl01", parentId: 0, menuName: "사용자 > 현재위치", icon: "description", pagePath: "views/ui/cnsl", componentName: "BCT-1", url: "/ui/cnsl/bct1", tempmenu: "cnsl" },
	// { menuId: "cnsl02", parentId: 0, menuName: "알림설정", icon: "description", pagePath: "views/ui/cnsl", componentName: "BCT-7-13", url: "/ui/cnsl/bct_7_13", popup: true, meta: { layout: 'Popup' }, tempmenu: "cnsl" },
	//
	// /* DB관리 */
	// { menuId: "db01", parentId: 0, menuName: "DB > 목록", icon: "description", pagePath: "views/ui/db", componentName: "BDB", url: "/ui/db/list", tempmenu: "db"},
	// { menuId: "db0101", parentId: "db01", menuName: "전체 DB", pagePath: "views/ui/db", componentName: "BDB_Tab01", url: "/ui/db/list/all", tempmenu: "db", tabmenu: true },
	// { menuId: "db0102", parentId: "db01", menuName: "등록요청 DB", pagePath: "views/ui/db", componentName: "BDB_Tab02", url: "/ui/db/list/reqst", tempmenu: "db", tabmenu: true },
	// { menuId: "db0103", parentId: "db01", menuName: "회수요청 DB", pagePath: "views/ui/db", componentName: "BDB_Tab03", url: "/ui/db/list/back", tempmenu: "db", tabmenu: true },
	//
	//
	// /* 푸터 */
	// { menuId: "foo01", parentId: 0, menuName: "녹취조회(pop)", icon: "description", pagePath: "views/ui/foo", componentName: "CFT1", url: "/ui/foo/cft1", tempmenu: "foo" },
];

export default {
	list: menu
}