import { CD } from "./cd.mjs"

let cd = new CD(1, "Blockbuster Hits", "Red Box", 12, 19.99);
console.log(`cd is an instance of CD: ${cd instanceof CD}`)
let cd_str = JSON.stringify(cd)
console.log(cd_str)
console.log(JSON.parse(cd_str))

cd = new CD("1", "Blockbuster Hits", "Red Box", "12", "19.99");
cd_str = JSON.stringify(cd)
console.log(cd_str)

try {
    cd = new CD("1", "Blockbuster Hits", "Red Box", -1, "-19.99");
    cd_str = JSON.stringify(cd)
    console.log(cd_str)
} catch (anError) {
    console.error(anError)
} finally {
    console.log("Let's try again, shall me?")
}

try {
    cd = new CD("1", "Blockbuster Hits", "Red Box", 1, "-19.99");
    cd_str = JSON.stringify(cd)
    console.log(cd_str)
} catch (anError) {
    console.error(anError)
} finally {
    console.log("Let's try again, shall me?")
}

try {
    cd = new CD("1", "Blockbuster Hits", "Red Box", 1);
    cd_str = JSON.stringify(cd)
    console.log(cd_str)
} catch (anError) {
    console.error(anError)
} finally {
    console.log("Let's try again, shall me?")
}
