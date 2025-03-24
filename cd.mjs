/*
This is a simple CD class in ES6 sytax.
*/


class CD {
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
        this._id = id;
    }

    get title() {
        return this._title;
    }

    set title(title) {
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
        this._tracks = tracks;
    }

    get price() {
        return this._price;
    }

    set price(price) {
        this._price = price;
    }
}

const cd = new CD(1, "Blockbuster Hits", "Red Box", 12, 19.99);
console.log(`cd is an instance of CD: ${cd instanceof CD}`)
const cd_str = JSON.stringify(cd)
console.log(cd_str)
console.log(JSON.parse(cd_str))
