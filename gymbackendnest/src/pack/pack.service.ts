import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pack } from './schemas/pack.schema';
import { SERVER_URL } from 'src/config/constants';
/*** imports to handle image on backend server */
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

@Injectable()
export class PackService {
  constructor(@InjectModel(Pack.name) private packModel: Model<Pack>) {}
  /****function to create a pack document ****************************/

  async createPack ( 

    nameplan: string,
    trialdays: number,
    description: string,
    features: string,
    timedays: number,
    cost: number,
    code: string,
    status: string,
    file: Express.Multer.File){

    //console.log('Im at pack.services.ts - line 29 - trialdaysFeatures:' + timedays);
    // Get the current date
    const currentDate = new Date();
    const SessionTime: any = timedays;
    // Add timedays days to the current date
    const futureDate = new Date(
    // Add session_time to get finish Class time
    currentDate.getTime() + ( SessionTime * 24 * 60 * 60 * 1000 )
    );
    const imagePath = file
      ? `/uploads/${file.filename}`
      : `${SERVER_URL}/uploads/image.jpg`;

    const GetPackParams = ({
      nameplan: nameplan,
      trialdays: trialdays,
      description: description,
      features: features,
      timedays: timedays,
      cost: cost,
      code: code,
      status: status,
      createdAt: new( Date ),
      image: imagePath,
      finishAt: futureDate,
   });

    const newPack: any = new this.packModel(GetPackParams);
    return await newPack.save();
  }
  /**** end of the block to create a Pack document *******************/
  /*****************  function to put(update) a pack by Id ***********************/
  async updatePack(
    id: string,
    nameplan: string,
    trialdays: number,
    description: string,
    features: string,
    timedays: number,
    cost: number,
    code: string,
    status: string,
    file: Express.Multer.File) {
    // Get the current date
    const currentDate = new Date();
    const SessionTime: any = timedays;
    // Add timedays days to the current date
    const futureDate = new Date(
    // Add session_time to get finish Class time
  currentDate.getTime() + ( SessionTime * 24 * 60 * 60 * 1000 )
    );
    const imagePath = file
      ? `/uploads/${file.filename}`
      : `${SERVER_URL}/uploads/image.jpg`;
    const GetPackParams = ({
      nameplan: nameplan,
      trialdays: trialdays,
      description: description,
      features: features,
      timedays: timedays,
      cost: cost,
      code: code,
      status: status,
      createdAt: new( Date ),
      finishAt: futureDate,
      image: imagePath,

    });
    const updatedPack = await this.packModel.findByIdAndUpdate(
      id,
      GetPackParams,
      { new: true });
    if (!updatedPack) {
      throw new NotFoundException('Pack not found');
    }
    return updatedPack;
  }
  /*****************  end of block function to put a class by Id ***********************/
  /*** function to get all packs ************************************/
  async findAllPacks(){
    //console.log('Estoy en pack.service - line 101 - findAllPacks');
    const packs: any = await this.packModel
      .find({})
      .limit(12)
      .sort({ createdAt: -1 });
    const total = packs.length
    //console.log('Estoy en pack.service - line 107 - findallpacks: '+ packs[0].nameplan); 
    //console.log('Estoy en pack.service - line 108 - packs.length: '+ total); 
    return { packs, total };
  }
  /***** End of function to get all Packs *******************************/
  /*****************  function to get a Pack by Id ***********************/
  async findPackById(id: string){
    const packById: any = await this.packModel.findById({ _id: id });
    //console.log('Estoy en packService - line 116 - packById.nameplan: ' + packById.nameplan);
    // console.log('Estoy en packService - line 118 - packById.image: ' + packById.image);
    if (!packById) {
      throw new NotFoundException('Pack not found');
    }
    return packById;
  }

  /*********************** end of function to get a Pack by Id  *********/
  /**** function to erase image in upload dir */
  deleteImagePack(  image: string ) {
    //const Image = image;
    const Image: string = path.basename(image);
    //const filePath = Image;
    const filePath = path.join(__dirname, '../../uploads', Image);
    //console.log('Estoy en pack.service.ts - line 131 - deleteImagepack - image: ' + filePath );
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          //console.log('Estoy en pack.service.ts - line 136 - deleteImagePack - File not found ');
          const message: string = 'File not found';
          return message;
        }
        const message: string = 'Error deleting file';
        return message;
      }
      /*console.log(
          'Estoy en pack.service.ts - line 113 - deleteImagepack - File deleted successfully ');*/
      const message: string = 'File deleted successfully';
      return message;
    });
  }
  /**** End of block to erase image in upload dir *************************************/
  /**** funtion to delete a pack *******************************************************/
  async deletePack(id: string) {
    const deletedPack = await this.packModel.findByIdAndDelete(id);
    //console.log('Estoy en pack.service.ts - line 154 - deletePack : ' + deletedPack );
    if (!deletedPack) {
      const message: string = 'Class not found ..';
      //console.log('Estoy en pack.service.ts - line 158 - deletePack - message : '+ message );
      return message;
    }
    const message: string = 'Class Deleted Successfully ..';
    //console.log('Estoy en pack.service.ts - line 163 - deletePack - message : ' + message);
    return message;
  }

  /***** End of Block to funtion to delete a class **************************************/
  /*****************  function to get a Pack by Code ***********************/
  async findPackByCode(code: string){
    const packByCode: any = await this.packModel.findOne({ code: code });
    /*console.log(
      'Estoy en packService - line 174 - packByCode.nameplan: ' + packByCode.nameplan);*/
     /*console.log(
      'Estoy en packService - line 176 - packByCode.image: ' + packByCode.image);*/
    if (!packByCode) {
      throw new NotFoundException('Pack not found');
    }
    return packByCode;
  }

  /*********************** end of function to get a Pack by Code  *********/

}
