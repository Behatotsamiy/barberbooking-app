import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as FormData from "form-data";




@Injectable()
export class filesService{
    private API_KEY: string = process.env.IMGBB_API_KEY;
    async uploadToImgBB(file: Express.Multer.File) {
    const form = new FormData();

    // buffer → file
    form.append('image', file.buffer.toString('base64'));

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${this.API_KEY}`,
      form,
      {
        headers: form.getHeaders(),
      },
    );

    return res.data.data.url;
  }
}