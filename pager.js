const PAGE_LIMIT = 12;

const Prompt = require("./prompt");
const API = require("./api");

/**
 * @param {Number} curr 
 * @param {Number} p
 * @param {Number} total
 */
const createPage = (curr, p, total) => $(`<li><a class="page-${p == "..." ? "disable" : 
                    curr == p ? "active" : "btn"}">` + 
                    `${String(p).padStart(String(total).length, " ").replace(/ /g, "&nbsp;")}</a></li>`);

/** @param {{curr:Number,onpage:Function}} param0 */
const createView = ({ curr, total, min=0, onpage, canJump=false }) => {
    total = Math.max(total, min);
    const prev = $(`<li><a class="page-${curr > 0         ? "btn" : "disable"}" id="prev-page">` + 
                   `<span uk-pagination-previous></span></a></li>`);
    const next = $(`<li><a class="page-${curr < total - 1 ? "btn" : "disable"}" id="next-page">` +
                   `<span uk-pagination-next    ></span></a></li>`);
    const jumpTo = $(`<li><a class="btn">select page</a></li>`);

    prev.click(() => curr > 0         && setImmediate(() => onpage(curr - 1)));
    next.click(() => curr < total - 1 && setImmediate(() => onpage(curr + 1)));
    jumpTo.click(() => {
        Prompt.alert.fire({
            title: "Select Page",
            showCancelButton: true,
            confirmButtonText: "Go",
            input: "number",
            inputValidator: val => {
                if (val != ~~val) return "Integer expected";
                val = ~~val;
                if (val <= 0 || val > total) return `Page must range from 1 to ${total}`;
            },
            inputValue: curr + 1
        }).then(result => {
            if (result.value) {
                curr == result.value || setImmediate(() => onpage(~~result.value - 1));
            }
        });
    });

    let pages = [];

    if (total <= 9) {
        for (let i = 0; i < total; i++) {
            let page = createPage(curr + 1, i + 1, total);
            page.click(() => curr == i || setImmediate(() => onpage(i)));
            pages.push(page);
        }
    } else {
        const PAD = 4;
        let between = [];
        for (let i = 2; i < total - 3; i++)
            Math.abs(i - curr) < PAD + 1 && (i - curr) < PAD && between.push(i);
        let indices = [0, 1, ...between, total - 3, total - 2, total - 1];
        // Vacant value, push "..."
        indices.reduce((prev, val) => {
            let page = createPage(curr + 1, (val == prev + 1) ? val + 1 : "...", total);

            page.click(() => curr != val && val == prev + 1 && 
                setImmediate(() => onpage(val)));

            pages.push(page);
            return val;
        }, -1);
    }

    return canJump ? [prev, ...pages, next, jumpTo] : [prev, ...pages, next];
}

/** @param {Boolean} allowUpload */
const emptySkinPanel = allowUpload =>
`<div class="uk-width-1-6@l uk-width-1-4@m uk-width-1-2 uk-card uk-margin-top">
    <div class="half-width padding-s uk-inline-clip uk-transition-toggle uk-text-center card">
        <img src="assets/img/logo-grey.png" class="skin-preview skin-empty">
        ${!!allowUpload ? 
       `<div class="uk-position-center">
            <span class="text uk-transition-fade pointer skin-upload" uk-icon="icon:cloud-upload;ratio:2" uk-tooltip="Upload skin"></span>
        </div>`:""}
    </div>
</div>`;

/** @param {ClientSkin} skinObject */
const createMySkinPanel = skinObject => {

    let link = skinObject.status === "approved" ? `/s/${skinObject.skinID}` : `/p/${skinObject.skinID}`;
    let labelClass = { "approved": "success", "pending": "warning", "rejected": "danger" }[skinObject.status];
    return "" +
    `<div class="uk-width-1-6@l uk-width-1-4@m uk-width-1-2 uk-card uk-margin-top">
        <div class="half-width padding-s uk-inline-clip pointer uk-text-center uk-transition-toggle card">
            <div>
                <a href="${link}" data-type="image" data-caption="<h1 class='text uk-margin-large-bottom'>${escapeHtml(skinObject.skinName)}</h1>">
                    <img src="${link}" class="skin-preview uk-transition-scale-up uk-transition-opaque">
                </a>
            </div>
            <div class="top-right uk-label uk-label-${labelClass} uk-transition-slide-top">${skinObject.status}</div>
            <h3 class="text uk-position-bottom-center uk-margin-small-bottom">${escapeHtml(skinObject.skinName)}</h3>
            <div class="top-left">
                <span uk-icon="icon:${skinObject.public ? "users" : "lock"};ratio:1.5" 
                      class="text uk-transition-slide-top info skin-edit ${skinObject.public ? "" : "danger-text"}"
                      skin-id="${skinObject.skinID}" skin-name="${skinObject.skinName}" ${skinObject.public ? "skin-public='true'" : ""} 
                      uk-tooltip="This skin is ${skinObject.public ? "public" : "private"}"></span>
            </div>
            <div class="bottom-left">
                <span uk-icon="icon:star;ratio:1.5" class="text uk-transition-slide-bottom info skin-stars"
                      uk-tooltip="${skinObject.favorites} stars"></span>
            </div>
            <div class="bottom-right">
                ${skinObject.status === "approved" ? `<span uk-icon="icon:link;ratio:1.5"      class="text uk-transition-slide-bottom skin-link"
                link="${window.location.origin}${link}" uk-tooltip="Copy link"></span><br>` : ""}

                ${skinObject.status === "pending" ? "" : ` <span uk-icon="icon:file-edit;ratio:1.5" class="text uk-transition-slide-bottom skin-edit"
                skin-id="${skinObject.skinID}" skin-name="${skinObject.skinName}" ${skinObject.public ? "skin-public='true'" : ""} 
                uk-tooltip="Edit"></span><br>`}

                ${skinObject.status === "pending" ? "" : `<span uk-icon="icon:trash;ratio:1.5"     class="text uk-transition-slide-bottom skin-delete"
                skin-id="${skinObject.skinID}" skin-name="${skinObject.skinName}" uk-tooltip="Delete"></span>`}
            </div>
        </div>
    </div>`;
}

/** @param {ClientSkin} skinObject */
const createPubSkinPanel = skinObject => {
    let link = `/s/${skinObject.skinID}`;
    
    return "" +
    `<div class="uk-width-1-6@l uk-width-1-4@m uk-width-1-2 uk-card uk-margin-top">
        <div class="half-width padding-s uk-inline-clip pointer uk-text-center uk-transition-toggle card">
            <div>
                <a href="${link}" data-type="image" data-caption="<h1 class='text uk-margin-large-bottom'>${escapeHtml(skinObject.skinName)}</h1>">
                    <img src="${link}" class="skin-preview uk-transition-scale-up uk-transition-opaque">
                </a>
            </div>
            <h3 class="text uk-position-bottom-center uk-margin-small-bottom">${escapeHtml(skinObject.skinName)}</h3>
            <div class="bottom-left">
                <span uk-icon="icon:star;ratio:1.5" class="text uk-transition-slide-bottom info skin-stars"
                    skin-id="${skinObject.skinID}" skin-name="${skinObject.skinName}" uk-tooltip="${skinObject.favorites} stars"></span>
            </div>
            <div class="bottom-right">
                <span uk-icon="icon:link;ratio:1.5" class="text uk-transition-slide-bottom skin-link"
                    link="${window.location.origin}${link}" uk-tooltip="Copy link"></span><br>
            </div>
        </div>
    </div>`;
}

const escapeHtml = unsafe => unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");

const copyText = element => {
    let range, selection;
    
    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    try {
        document.execCommand('copy');
        return true;
    }
    catch (err) {
        return false;
    }
}

module.exports = new class Pager {

    constructor() {
        this.element = $("#pager");
        this.page = 0;
        this.copyEl = document.getElementById("copy");
    }

    /** @param {ClientSkin[]} skins */
    async viewMySkins(skins, page = this.page) {
        
        this.page = page = Math.min(page, Math.ceil(skins.length / 12));

        let skinsInView = skins.slice(PAGE_LIMIT * page, PAGE_LIMIT * (page + 1));
        let skinsHTML = skinsInView.map(createMySkinPanel).join("");
        let emptySkinsHTML = emptySkinPanel(true).repeat(PAGE_LIMIT - skinsInView.length);

        let panel = $("#my-skins");
    
        panel.fadeIn(500);
        panel.children().remove();
        panel.append($(skinsHTML + emptySkinsHTML));
    
        this.addSkinUpload();
        this.addSkinEdit();
        this.addSkinDelete();
        this.addCopyLink();
    
        this.clearView();
        let view = createView({ curr: page, total: Math.ceil(skins.length / 12), min: 5,
            onpage: p => this.viewMySkins(skins, p)
        });

        this.element.append(view);
    }

    /** @param {ClientSkin[]} skins */
    async viewFavSkins(skins, page = this.page) {
        
        this.page = page = Math.min(page, Math.ceil(skins.length / 12) - 1);

        let skinsInView = skins.slice(PAGE_LIMIT * page, PAGE_LIMIT * (page + 1));
        let skinsHTML = skinsInView.map(createPubSkinPanel).join("");
        let emptySkinsHTML = emptySkinPanel().repeat(PAGE_LIMIT - skinsInView.length);

        let panel = $("#fav-skins");
    
        panel.fadeIn(500);
        panel.children().remove();
        panel.append($(skinsHTML + emptySkinsHTML));
    
        this.addStar();
        this.addCopyLink();
    
        this.clearView();
        let view = createView({ curr: page, total: Math.ceil(skins.length / 12),
            onpage: p => this.viewFavSkins(skins, p)
        });

        this.element.append(view);
    }

    /**
     * @param {{total:Number,page:number,skins:ClientSkin[]}} param0
     */
    async viewPublicSkins({ total = 0, page = this.page, skins }) {

        skins = skins || [];
        this.page = page = Math.min(page, Math.ceil(total / 12));

        let skinsHTML = skins.map(createPubSkinPanel).join("");
        let emptySkinsHTML = emptySkinPanel(false).repeat(Math.max(PAGE_LIMIT - skins.length, 0));
        let panel = $("#pub-skins");
    
        panel.fadeIn(500);
        panel.children().remove();
        panel.append($(skinsHTML + emptySkinsHTML));

        this.addCopyLink();
        this.addStar(true);

        this.clearView();
        let view = createView({ curr: page, total: Math.ceil(total / 12), 
            canJump: true,
            onpage: async p => {
                Prompt.showLoader();
                let result = await API.getPublic({ page: p, force: true });
                Prompt.hideLoader();
                this.viewPublicSkins({ skins:result.skins, page: p, 
                                       total:result.total });
            }
        });

        this.element.append(view);
    }

    addStar(already = false) {
        $(".skin-stars").click(function() {
            let id = $(this).attr("skin-id");

            if (API.favorites.some(s => s.skinID == id))
                Prompt.unstarSkin(id, $(this).attr("skin-name"), already);
            else
                Prompt.starSkin(id, $(this).attr("skin-name"));
        });
    }

    addSkinUpload() {
        $(".skin-upload").click(() => Prompt.inputImage());
    }

    addSkinEdit() {
        $(".skin-edit").click(function() {
            Prompt.editSkin({ 
                skinID: $(this).attr("skin-id"),
                oldName: $(this).attr("skin-name"),
                wasPublic: !!$(this).attr("skin-public") });
        });
    }

    addSkinDelete() {
        $(".skin-delete").click(function() {
            Prompt.deleteSkin($(this).attr("skin-id"), $(this).attr("skin-name"));
        });
    }

    addCopyLink() {
        let copyEl = this.copyEl;
        $(".skin-link").click(function() {

            $(copyEl).val($(this).attr("link"));
            $(copyEl).text($(this).attr("link"));
            
            if (copyText(copyEl))
                Prompt.copied($(copyEl).val());
            else
                Prompt.copyFail($(copyEl).val());
        });
    }
    
    clearView() {
        this.element.children().remove();
    }
}