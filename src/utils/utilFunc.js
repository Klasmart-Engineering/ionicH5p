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
            const script = document.createElement("script");
            document.getElementById(elementName)?.appendChild(script);
            script.onload = () => {
                try {
                    document.getElementById(elementName)?.removeChild(script);
                } catch (err) {
                    console.log(err);
                }
                resolve();
                // console.log("finished: " + src);
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
        // console.log(style);
        document.getElementById(elementName).appendChild(link);
    }
};
