import ErrnoException = NodeJS.ErrnoException;
const shortid = require('shortid');
const fs = require('fs');
import { createWriteStream, unlink } from "fs";
const storeUpload = async ({ buffer, mimetype }: any, savePath: string): Promise<any> => {

    const extension = mimetype.split("/")[1];
    const id = `${savePath}/${shortid.generate()}.${extension}`;
    const path = `src/images/${id}`;
    await fs.writeFile(path, buffer, (_err) => {
      
    });
    return path;
    // aseq2
    // const extension = mimetype.split("/")[1];
    // const id = `${savePath}/${shortid.generate()}.${extension}`;
    // const path = `src/images/${id}`;
    // const stream = createReadStream();
    // return new Promise((resolve, reject) =>
    //     stream
    //         .pipe(createWriteStream(path))
    //         .on("finish", () => resolve({ id, path }))
    //         .on("error", reject)
    // );
};
export const processUpload = async (upload: any, savePath: string) => {
    console.log(upload);
    console.log(savePath);
    const { buffer, mimetype } = await upload;
    const id = await storeUpload({ buffer, mimetype }, savePath);
    return id;
};
export const processDelete = async (filename: string) => {
    await unlink(`src/images/${filename}`, (err: ErrnoException | null) => {
        if(err) {
            console.log(err)
        } else {
            console.log('file deleted')
        }
    })
};