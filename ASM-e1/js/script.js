var app = angular.module("myApp", ["ngRoute"]);
app.controller('ctrlHead', function($scope, $http){
    var MEMBER_API = "https://youtube-api-challenger.appspot.com/members";
    var secretToken = localStorage.getItem("secretToken");
    var userId = localStorage.getItem("userId");
    if (secretToken != null && userId != null) {
        $http({
            method : "GET",
            url : MEMBER_API + "/" + userId,
            headers: {
                "Authorization": secretToken
            }
        }).then(function mySuccess(response) {
            console.log(response);
            $scope.loggedInUsername = response.data.data.attributes.username;
            $scope.isLoggedIn = true;
        }, function myError(response) {
            $scope.isLoggedIn = false;
            console.log(response.statusText);
        });

    }
    
    $scope.btnLogout = function() {
        if(confirm("Bạn có chắc muốn thoát khỏi hệ thống?")){
            localStorage.removeItem("secretToken");
            localStorage.removeItem("userId");
            $scope.isLoggedIn = false;
            alert("Logout thành công.");
        }
    };
});

app.controller('ctrlBar', function($scope, $http){
	var count = 2;

    $('.ishow').toggle();
    $('.menuli').attr('class','menuliTini');
    $(".menuBar").animate({width:'70px'});
    $(".video").animate({margin:'0 0 0 70px'});
    $('.avaMenuImg img').animate({width:'30px',height:'30px'});
	$scope.btnNav = function(){
		
		if (count%2) {
			$('.ishow').toggle();
			$('.menuli').attr('class','menuliTini');
			$(".menuBar").animate({width:'70px'});
			$(".video").animate({margin:'0 0 0 70px'});
			$('.avaMenuImg img').animate({width:'30px',height:'30px'});
		}
		else{
			$('.menuliTini').attr('class','menuli');
			$(".menuBar").animate({width:'227px'});
			$(".video").animate({margin:'0 0 0 227px'});
			$('.avaMenuImg img').animate({width:'45px',height:'45px'});
			$('.ishow').toggle();
		}
		count++;
	};	
});
app.controller('ctrlLogin', function($scope, $http){
    if (localStorage.getItem("secretToken")) {
        window.location.href = "index.html";
    }
    $scope.myFunction = function() {
        var object = {
            "data":{
                "type":"MemberLogin",
                "attributes": {
                    "username":"",
                    "password":""
                }
            }   
        }
        if ($scope.object.data.attributes.username.length > 7 && $scope.object.data.attributes.password.length > 7) {
            login();
            $("input[name=password]").parent().siblings("span").text('');
            $("input[name=username]").parent().siblings("span").text('');
        }
    }
    function login(){
        $http({
            method : "POST",
            url : "https://youtube-api-challenger.appspot.com/authentication",
            data : $scope.object
        }).then(function mySuccess(response) {
            console.log(response);
            //Tạo chìa khóa secretToken
            // alert(response.data.data.attributes.secretToken);
            var userId = localStorage.setItem("userId", response.data.data.attributes.userId);
            var secretToken = localStorage.setItem("secretToken", response.data.data.attributes.secretToken);
            //Thông báo
            $('.alert-success').text('Thành Công');
            $('.alert-success').attr('style','display : inline-block');
            $('.alert-danger').attr('style','display : none');
            alert('Đăng Nhập Thành Công');
            //Điều hướng trang
            window.location.href = "index.html";
        }, function myError(response) {
            // Chuyển dũ liệu trả về sang JSON      
            console.log(response);
            // Thông báo lỗi
            $('.alert-danger').text(response.data.errors[0].title + " " + response.data.errors[0].detail);
            $('.alert-danger').attr('style','display : inline-block');  
            $('.alert-success').attr('style','display : none');                 
        });
    }
});
app.controller('ctrlRegister', function($scope, $http){
    //Nếu đã đăng nhập (đã có secretToken ) thì sẽ điều hướng về trang index
    if (localStorage.getItem("secretToken")) {
        window.location.href = "index.html";
    }
    $scope.object = {
            "data" : {
                "type":"MemberLogin",
                "attributes": {
                    "username":"",
                    "password":"",
                    "fullName": "",
                    "email": "",
                    "birthDay": 15066499900231,
                    "gender": 1
                }
            }   
        }
    $scope.myFunction = function() {
        if ($scope.object.data.attributes.username.length > 7 
            && $scope.object.data.attributes.password.length >7 
            && $scope.object.data.attributes.rePassword == $scope.object.data.attributes.password 
            && $scope.object.data.attributes.fullName.length > 0 
            && $scope.object.data.attributes.email.length > 6) {
            register();
        }
    }

    function register(){
        $http({
            method : "POST",
            url : "https://youtube-api-challenger.appspot.com/members",
            data : $scope.object
        }).then(function mySuccess(response) {
            console.log(response.data);
            // Thông báo
            $('.alert-success').text('Thành Công');
            $('.alert-success').attr('style','display : inline-block');
            $('.alert-danger').attr('style','display : none');
            //điều hướng trang
            window.location.href = "login.html";
        }, function myError(response) {
            // Hiển thị lỗi
            $('.alert-danger').text(response.data.errors[0].title + " " + response.data.errors[0].detail);
            $('.alert-danger').attr('style','display : inline-block');  
            $('.alert-success').attr('style','display : none');             
            // alert(jsonObject.errors[0].title + " " + jsonObject.errors[0].detail);
        });
    }
});

app.controller('ctrlAddVideo', function($scope, $http){
    var secretToken = localStorage.getItem("secretToken");

    //Kiểm tra secretToken
    if (!localStorage.getItem("secretToken")) {
        $('fieldset').html('');
        $(document).ready(function(){
            alert('Bạn phải đăng nhập');
            window.location.href = "index.html";
        }); 
    }
    $scope.btnAdd = function() {
        // var object = {
        //     "data": {
        //         "type":"Video",
        //         "attributes": {
        //             "youtubeId": '',
        //             "name": '',
        //             "description": '',
        //             "keywords": '',
        //             "playlistId": 1,  
        //             "thumbnail": ''
        //         }
        //     }
        // };
        $http({
            method : "POST",
            url : "https://youtube-api-challenger.appspot.com/videos",
            headers: {
                Authorization: secretToken
            },
            data : $scope.object
        }).then(function mySuccess(response) {
            console.log(response);
            //Thông báo khi thành công
            $('.alert-success').text('Thành Công');
            $('.alert-success').attr('style','display : inline-block');
            //Xóa thông báo sau 3s
            setTimeout(function(){
                $('.alert-success').attr('style','display : none');
            },3000);
            //Xóa các trường input khi thành công
            $scope.object.data.attributes.youtubeId = "";
            $scope.object.data.attributes.name = "";
            $scope.object.data.attributes.description = "";
            $scope.object.data.attributes.keywords = "";
            $scope.object.data.attributes.thumbnail = "";
        }, function myError(response) {
            console.log(response);
            //Thông báo khi có lỗi                      
            $('.alert-danger').text(response.data.errors[0].title + " " + response.data.errors[0].detail);
            $('.alert-danger').attr('style','display : inline-block');
            //Xóa thông báo sau 3s
            setTimeout(function(){
                $('.alert-danger').attr('style','display : none');
            },3000);
        });
    }

    $scope.inputSearch = "Hà Anh Tuấn";
    search();
    $scope.btnsearch = function() {
        search();
    }

    function search(){
        var YOUTUBE_API = "https://content.googleapis.com/youtube/v3/search?q="+$scope.inputSearch+"&type=video&maxResults=9&part=snippet&key=AIzaSyAwUjk3CwtXCiB_W6Xi0colfOKPgm90hHc";
        $http({
            method : "GET",
            url : YOUTUBE_API,
        }).then(function mySuccess(response) {
            
            $scope.listVideos = response.data.items;
            console.log($scope.listVideos);
        });
    }

    var videoFrame = document.getElementById("video-frame");


    $scope.showVideo = function(videoId){
        videoFrame.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1";
        setTimeout(function(){ 
            $('#modal-video').modal();
        }, 300);
    }

    $scope.closeVideo = function(){
        videoFrame.src = "";
        $scope.isShowVideo = false;
    }
    //Hàm lấy thông tin và điền vào input
    $scope.addVideo = function(idVideo, thumbnails){
        $("input[name=youtubeId]").val(idVideo);
        var title = $('#'+idVideo+'').text();
        $("input[name=name]").val(title);
        $("input[name=description]").val("hay");
        $("input[name=keywords]").val("Quyến đẹp troai");
        $("input[name=thumbnail]").val(thumbnails);

    }
    $(".btn-home").click(function(){
        window.location.href = "index.html";
    });
});

app.controller('ctrlPlaylist', function($scope, $http){
    var secretToken = localStorage.getItem("secretToken");

    if (!localStorage.getItem("secretToken")) {
        $('fieldset').html('');
        $(document).ready(function(){
            alert('Bạn phải đăng nhập');
            window.location.href = "index.html";
        }); 
    }

    var YOUTUBE_API = "https://youtube-api-challenger.appspot.com/videos";
    $http({
        method : "GET",
        url : YOUTUBE_API,
        data : function(){},
        headers: {
        Authorization: secretToken
    },
    }).then(function mySuccess(response) {

        $scope.playlists = response.data.data;
        console.log($scope.playlists);
    });

    var videoFrame = document.getElementById("video-frame");
    
    $scope.showVideo = function(videoId){
        videoFrame.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1";
        setTimeout(function(){ 
            $('#modal-video').modal();
        }, 300);
    }
});

app.controller('ctrlSearch', function($scope, $http){
    var search = $('.valueSearch').val();
    var secretToken = localStorage.getItem("secretToken");
    searchVideo();
    $scope.btnSearch = function() {
        searchVideo();
        $scope.maxVideo = 18;
    }

    function searchVideo(){
        var YOUTUBE_API = "https://content.googleapis.com/youtube/v3/search?q="+search+"&type=video&maxResults=9&part=snippet&key=AIzaSyAwUjk3CwtXCiB_W6Xi0colfOKPgm90hHc";
        $http({
            method : "GET",
            url : YOUTUBE_API,
            data : function(){}
        }).then(function mySuccess(response) {
            $scope.listVideo = response.data.items;
        });
    }

    $scope.addVideo = function(idVideo, thumbnails){
        var name = $('#'+idVideo+'').text();
        $scope.object = {
            "data": {
                "type":"Video",
                "attributes": {
                    "youtubeId": idVideo,
                    "name": name,
                    "description": 'Hay',
                    "keywords": 'Quyến đẹp troai',
                    "playlistId": 1,  
                    "thumbnail": thumbnails
                  }
                }
            };
        $http({
            method : "POST",
            url : "https://youtube-api-challenger.appspot.com/videos",
            headers: {
                Authorization: secretToken
            },
            data : $scope.object
        }).then(function mySuccess(response) {
            console.log(response);
            alert('Thêm Video thành công');
        }, function myError(response) {
            alert(response.data.errors[0].title + ' - ' +response.data.errors[0].detail);
            console.log(response);
        });
    }

    $scope.maxVideo = 18;

    $scope.btnMore = function(){
        var search = $('.valueSearch').val();
        var YOUTUBE_API = "https://content.googleapis.com/youtube/v3/search?q="+search+"&type=video&maxResults="+$scope.maxVideo+"&part=snippet&key=AIzaSyAwUjk3CwtXCiB_W6Xi0colfOKPgm90hHc";
        $http({
            method : "GET",
            url : YOUTUBE_API,
            data : function(){}
        }).then(function mySuccess(response) {
            $scope.listVideo = response.data.items;
        });
        $scope.maxVideo +=9;
    }
    $scope.onTop = function(){
        $('#toTop').tooltip('hide');
        $('body,html').animate({
            scrollTop: 0
        }, 800);
    }

    var videoFrame = document.getElementById("video-frame");
    $scope.showVideo = function(videoId, thumbnails){
        var title = $('#'+videoId+'').text();
        $('#idVideo').val(videoId);
        $('#thumbnail').val(thumbnails);
        $('#nameVideo').val(title);
        window.location.href = "index.html#!/video"
        // videoFrame.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1";
        // setTimeout(function(){ 
        //     $('#modal-video').modal();
        // }, 300);
    }
});

app.controller('ctrlVideo', function($scope, $http){
    $scope.titleVideo = $('#nameVideo').val();
    var videoId = $('#idVideo').val();
    var nameVideo = $('#nameVideo').val();
    var thumbnail = $('#thumbnail').val();
    var videoFrame = document.getElementById("video-frame");
    videoFrame.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1";
    var search = $('.valueSearch').val();
    var YOUTUBE_API = "https://content.googleapis.com/youtube/v3/search?q="+search+"&type=video&maxResults=9&part=snippet&key=AIzaSyAwUjk3CwtXCiB_W6Xi0colfOKPgm90hHc";
    
    $http({
        method : "GET",
        url : YOUTUBE_API,
        data : function(){}
    }).then(function mySuccess(response) {
        $scope.listVideo = response.data.items;
    });

    $scope.showVideo = function(videoId, thumbnails){
        var title = $('#'+videoId+'').text();
        $('#idVideo').val(videoId);
        $('#thumbnail').val(thumbnails);
        $('#nameVideo').val(title);
        videoFrame.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1";
        $('#titleVideo').text(title);
    }

    $scope.addVideo = function(){
        var secretToken = localStorage.getItem("secretToken");
        var idVideo = $('#idVideo').val();
        var thumbnails = $('#thumbnail').val();
        var name = $('#nameVideo').val();

        $scope.object = {
            "data": {
                "type":"Video",
                "attributes": {
                    "youtubeId": idVideo,
                    "name": name,
                    "description": 'Hay',
                    "keywords": 'Quyến đẹp troai',
                    "playlistId": 1,  
                    "thumbnail": thumbnails
                  }
                }
            };
        $http({
            method : "POST",
            url : "https://youtube-api-challenger.appspot.com/videos",
            headers: {
                Authorization: secretToken
            },
            data : $scope.object
        }).then(function mySuccess(response) {
            console.log(response);
            alert('Thêm Video thành công');
        }, function myError(response) {
            alert(response.data.errors[0].title + ' - ' +response.data.errors[0].detail);
            console.log(response);
        });
    }
});
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "chucnang/main.html"
    })
    .when("/login", {
        templateUrl : "chucnang/login.html"
    })
    .when("/register", {
        templateUrl : "chucnang/register.html"
    })
    .when("/search", {
        templateUrl : "chucnang/search.html"
    })
    .when("/addVideo", {
        templateUrl : "chucnang/addVideo.html"
    })
    .when("/video", {
        templateUrl : "chucnang/video.html"
    })
    .when("/playlist", {
        templateUrl : "chucnang/playlist.html"
    })
    .when("/love", {
        templateUrl : "chucnang/love.html"
    })
    .when("/like", {
        templateUrl : "chucnang/like.html"
    })
    .when("/save", {
        templateUrl : "chucnang/save.html"
    })
    .when("/block", {
        templateUrl : "chucnang/block.html"
    })
    .when("/donate", {
        templateUrl : "chucnang/donate.html"
    });
});