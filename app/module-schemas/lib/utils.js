const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const transform = (doc, ret, options) => {
    ret = JSON.parse(JSON.stringify(ret));
    delete ret.__v;
    return ret;
}

export {emailRegex, transform};