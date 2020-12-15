import { SERVER_URL } from "../constants/constant";

export const appendStyle = (style, integrity, crossOrigin) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = style;
    link.integrity = integrity;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
};

export const appendScripts = async (scripts, elementName) => {
    for (const src of scripts) {
        const scriptPromise = new Promise((resolve, reject) => {
            // console.log("start:" + src);
            const script = document.createElement("script");
            // document.head.appendChild(script);
            document.getElementById(elementName).appendChild(script);
            script.onload = () => {
                // document.head.removeChild(script);
                document.getElementById(elementName).removeChild(script);
                resolve();
                console.log("finished: " + src);
            };
            script.onerror = reject;
            script.async = false;
            script.src = src;
        });
        await scriptPromise;
    }
};

export const appendStyles = (styles, elementName) => {
    for (const style of styles) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = style;
        console.log(style);
        // document.head.appendChild(link);
        document.getElementById(elementName).appendChild(link);
    }
};
