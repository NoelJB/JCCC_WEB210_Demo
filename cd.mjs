/*
This is a simple CD class in ES6 sytax.
*/


export class CD {
    constructor(id, title, artist, tracks, price) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.tracks = tracks;
        this.price = price;
    }

    // Custom serializer, since we don't want the _names in the JSON.
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            artist: this.artist,
            tracks: this.tracks,
            price: this.price
        }
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = parseInt(id);
    }

    get title() {
        return this._title;
    }

    set title(title) {
        if (!(typeof title == "string" || title instanceof String)) throw new Error(`Title (${title}) must be a string`)
        this._title = title;
    }

    get artist() {
        return this._artist;
    }

    set artist(artist) {
        this._artist = artist;
    }

    get tracks() {
        return this._tracks;
    }

    set tracks(tracks) {
        tracks = parseInt(tracks)
        if (tracks < 1) throw new Error(`Tracks (${tracks}) must be a postive number`)
        this._tracks = tracks;
    }

    get price() {
        return this._price;
    }

    set price(price) {
        const newPrice = parseFloat(price)
        if (isNaN(newPrice) || newPrice < 0) throw new Error (`Price (${price}) must be a postive number`)
        this._price = parseFloat(newPrice);
    }
}

/*
const cd = new CD(1, "Blockbuster Hits", "Red Box", 12, 19.99);
console.log(`cd is an instance of CD: ${cd instanceof CD}`)
const cd_str = JSON.stringify(cd)
console.log(cd_str)
console.log(JSON.parse(cd_str))
*/