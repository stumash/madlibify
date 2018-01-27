var firstHref = $("a[href^='http']").eq(0).attr("href")

console.log(firstHref)

$("#madlibify_button").on("click", () => {
    console.log("I did nothing doe")
})
