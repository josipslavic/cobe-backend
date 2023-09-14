import cloudinary from 'cloudinary'

export async function uploadPublicFile(file: Express.Multer.File) {
  const b64 = Buffer.from(file.buffer).toString('base64')
  let dataURI = 'data:' + file.mimetype + ';base64,' + b64
  const { secure_url: imageUrl, public_id: imageId } =
    await cloudinary.v2.uploader.upload(dataURI, {
      resource_type: 'auto',
    })
  return { imageUrl, imageId }
}

export async function deletePublicFile(imageId: string) {
  await cloudinary.v2.uploader.destroy(imageId)
}
