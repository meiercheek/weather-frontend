export const icons = (weatherType) => {
    switch (weatherType) {
        case ("Sunny"):
            return imageAssets[0].imageLink

        case ("Rain"):
            return imageAssets[1].imageLink

        case ("Cloudy"):
            return imageAssets[2].imageLink

        default:
            return empty.imageLink
    }
}

export const imageAssets = [
    {
        imageLink: require("./icons/Sunny.png"),
        title: "Sunny"
    },
    {
        imageLink: require("./icons/Rain.png"),
        title: "Rain"
    },
    {
        imageLink: require("./icons/Cloudy.png"),
        title: "Cloudy"
    },

]

export const empty = {
    imageLink: require("./icons/empty.png"),
    title: "Empty"
}