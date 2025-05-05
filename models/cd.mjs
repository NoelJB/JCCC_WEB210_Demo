/*
This is a simple CD class in ES6 sytax.
*/


export class CD {
    // private fields, using #-prefix
    #id; #title; #artist; #tracks; #price;

    constructor(id, title, artist, tracks, price) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.tracks = tracks;
        this.price = price;
    }

    // Custom serializer, since JSON.stringify otherwise ignores private fields.
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            artist: this.artist,
            tracks: this.tracks,
            price: this.price
        }
    }

    // Attach the object to our class definition.
    static attachType(obj) {
        return Object.setPrototypeOf(obj, CD.prototype)
    }

    get id() {
        return this.#id;
    }

    set id(id) {
        this.#id = parseInt(id);
    }

    get title() {
        return this.#title;
    }

    set title(title) {
        if (!(typeof title == "string" || title instanceof String)) throw new Error(`Title (${title}) must be a string`)
        this.#title = title;
    }

    get artist() {
        return this.#artist;
    }

    set artist(artist) {
        this.#artist = artist;
    }

    get tracks() {
        return this.#tracks;
    }

    set tracks(tracks) {
        tracks = parseInt(tracks)
        if (tracks < 1) throw new Error(`Tracks (${tracks}) must be a postive number`)
        this.#tracks = tracks;
    }

    get price() {
        return this.#price;
    }

    set price(price) {
        const newPrice = parseFloat(price)
        if (isNaN(newPrice) || newPrice < 0) throw new Error (`Price (${price}) must be a postive number`)
        this.#price = parseFloat(newPrice);
    }
}

/*
const cd = new CD(1, "Blockbuster Hits", "Red Box", 12, 19.99);
console.log(`cd is an instance of CD: ${cd instanceof CD}`)
const cd_str = JSON.stringify(cd)
console.log(cd_str)
console.log(JSON.parse(cd_str))
*/