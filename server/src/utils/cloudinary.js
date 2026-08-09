function extractPublicId(url) {

    if (!url) return null;

    const uploadIndex = url.indexOf("/upload/");

    if (uploadIndex === -1) return null;

    let publicId = url.substring(
        uploadIndex + 8
    );

    publicId = publicId.replace(
        /^v\d+\//,
        ""
    );

    publicId = publicId.replace(
        /\.[^/.]+$/,
        ""
    );

    return publicId;

}

module.exports = {
    extractPublicId,
};