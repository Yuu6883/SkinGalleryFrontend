const escapeHtml = unsafe => unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
         
$(window).on("load", () => {

    const API = require("./api");

    // window.API = API;
    const Prompt = require("./prompt");
    const Pager = require("./pager");
    const Starfield = require("./starfield");

    let halloween = false;
    let padoru = false;
    let today = new Date();
    let month = today.getMonth() + 1; // Autism
    let date  = today.getDate();

    if (localStorage.theme == "halloween" || 
        (month == 10 && date >= 15) ||
        (month == 11 && date == 1)) {
            
        halloween = true;
        // Halloween theme
        $(":root").prop("style").setProperty("--background-color", " rgba(30,13,0,.75) ");
        $(":root").prop("style").setProperty("--card--color",      "  #351733 ");

        $("#extra-info").html(`<img width="30" height="30" src="assets/img/pumpkin.png">` + 
                                `<span>Happy Halloween!</span>` + 
                              `<img width="30" height="30" src="assets/img/pumpkin.png">`);
    }

    if (localStorage.theme == "padoru" || month == 12) {
            
        padoru = true;
        // Padoru theme
        $(":root").prop("style").setProperty("--background-color", " rgba(0,37,57,0.75) ");
        $(":root").prop("style").setProperty("--card--color",      "  #002b45 ");
        $(":root").prop("style").setProperty("--button-color",      "  #6696ff ");
        $(":root").prop("style").setProperty("--button-hover",      "  #375abb ");
        $(":root").prop("style").setProperty("--button-disabled",   "  #666b7a ");

        $("#extra-info").html(`<img width="30" height="30" class="padoru pointer" src="assets/img/padoru.png">` +
                                `<span>Merry Christmas!</span>` + 
                              `<img width="30" height="30" class="padoru h-flip pointer" src="assets/img/padoru.png">`);

        const padoruSound = new Audio("/assets/mp3/padoru.mp3");
        $(".padoru").dblclick(() => {
            if (padoruSound.paused) {
                padoruSound.currentTime = 0;
                padoruSound.play();
                setTimeout(() => {
                    Prompt.alert.fire({
                        title: "PADORU PADORU",
                        imageUrl: "/assets/img/padoru.png"
                    });
                }, 9000);
            }
        });
    }

    if (localStorage.theme == "off") {
        halloween = false;
        padoru = false;
    }

    new Starfield($("#starfield")[0], { halloween, padoru }).start();

    $("#login").click(() => API.redirectLogin());
    $("#logout").click(() => API.logout());
    $("#upload").click(() => Prompt.inputImage());

    API.on("loginSuccess", () => {
        $("#login-panel").hide();
        $("#user-panel").show();
        $("#user-pfp").attr("src", API.avatarURL);
        $("#username").text(API.fullName);
        $("#skin-panel").show();

        if (API.userInfo.moderator) {
            // AB00000000SE
            $("#hack").show()
                .click(() => {
                    Prompt.inputMultipleImages();
                });
        }

        API.listSkin(true);
        $(".center").css("min-height", "100%");
    });

    API.on("loginFail", () => {
        Prompt.alert.fire("Login failed", "Please try again if you didn't" + 
                          " cancel Discord authorization", "warning");
    });

    API.on("logoutSuccess", () => {
        $("#login-panel").show();
        $("#user-panel").hide();
        $("#skin-panel").hide();
    });

    API.on("banned", date => Prompt.showBanned(date).then(() => {
        $("#login-panel").hide();
        $("#user-panel").show();
        $("#user-pfp").attr("src", "assets/img/lmao.png");
        $("#username").html("<strong>ACHIEVEMENT UNLOCKED</strong><br> You have been banned");
    }));

    API.on("myskin", skins => Pager.viewMySkins(skins));
    API.on("duplicate", s => Prompt.warnDuplicate(s));

    API.on("skinUploaded", res => {
        if (res.error) {
            Prompt.showError(res.error);
            return console.error(res.error);
        }
        Prompt.skinResult(res).then(() => API.listSkin(true));
    });

    API.on("skinEditSuccess", ({ newName, isPublic }) => {
        Prompt.skinEditResult({ name: escapeHtml(newName), isPublic })
              .then(() => API.listSkin(true));
    });

    API.on("skinDeleteSuccess", name => {
        Prompt.skinDeleteResult(escapeHtml(name))
              .then(() => API.listSkin(true));
    });

    API.on("favAdded", () => {
        Pager.viewFavSkins(API.favorites);
        Prompt.favAddSuccess();
    });

    API.on("favDelete", () => {
        Pager.viewFavSkins(API.favorites);
        Prompt.favDeleteSuccess();
    });

    API.on("error", e => {
        Prompt.alert.fire("Error", e ? (e.stack || e.message 
            || String(e)) : "Unknown error", "error");
    });

    $("#my-tab" ).click(() => API.listSkin());
    $("#pub-tab").click(() => API.getPublic({ force: true })
        .then(result => Pager.viewPublicSkins(result)));

    $("#fav-tab").click(() => Pager.viewFavSkins(API.favorites));

    API.init();

    $(document).ajaxStart(() => Prompt.showLoader());
    $(document).ajaxComplete(() => Prompt.hideLoader());
    $(document).ajaxError((_, xhr) => {
        Prompt.alert.fire({
            title: `Error[${xhr.status}]: ${xhr.statusText}`,
            text: "Please report this issue on discord.",
            type: "error"
        });
    });
});