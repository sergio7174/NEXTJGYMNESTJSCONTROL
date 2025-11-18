import { 
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  Res,
  UploadedFile,
  UseInterceptors}
from '@nestjs/common';
import { PackService } from './pack.service';
import { Request, Response } from 'express';
/*** TO HANDLE IMAGES WITH MULTER */
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'src/config/file-upload.config';

@Controller('pack')
export class PackController {
  constructor(private readonly packService: PackService) {}

  /*** function to create Pack document *********************************/
  @Post('')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async createpack(
    @Res() res: Response,
    @Body('nameplan') nameplan: string,
    @Body('trialdays') trialdays: number,
    @Body('description') description: string,
    @Body('features') features: string,
    @Body('timedays') timedays: number,
    @Body('cost') cost: number,
    @Body('code') code: string,
    @Body('status') status: string,
    @UploadedFile() file: Express.Multer.File,
  )
{
    //console.log('Im at pack.controller.ts - line 40 - go to pack.controller.createPack')
    const NewPack: any = await this.packService.createPack( 
      nameplan,
      trialdays,
      description,
      features,
      timedays,
      cost,
      code,
      status,
      file);
    if(NewPack){ 
      //console.log('Im at pack.controller.ts - line 54 - Pack Created Successfully ..');
      return res
        .status(200)
        .send({ NewPack: NewPack , message: 'Pack Created Successfully ..'})
    }
    if(!NewPack){
      //console.log('Im at pack.controller.ts - line 61 - Pack Not Created Successfully ..');
      res.status(200).send({ message: 'Pack Not Created successfully'})
    }
  }
  /*** end of function to create Pack document *********************************/

  /***** update-pack function ************************************* */
  @Put('update-pack/:id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async updatePack(
    @Param('id') id: string, 
    @Res() res: Response,
    @Body('nameplan') nameplan: string,
    @Body('trialdays') trialdays: number,
    @Body('description') description: string,
    @Body('features') features: string,
    @Body('timedays') timedays: number,
    @Body('cost') cost: number,
    @Body('code') code: string,
    @Body('status') status: string,
    @UploadedFile() file: Express.Multer.File){
    //console.log('Im at pack.controller.ts - line 83 - update-pack/:id ' + id);
    const updatedPack: any = this.packService.updatePack( 
      id, 
      nameplan,
      trialdays,
      description,
      features,
      timedays,
      cost,
      code,
      status, 
      file);
    return res.status(200).send({ message: 'Pack updated successfully',  updatedPack })
  }


  /**** End of update pack function ******************************** */
  /**** function to get all packs ******************************** */
  @Get('listAll')
  async listAll(
    @Req()
    req: Request,
    @Res() res: Response ) 
   {
    //console.log('Im at pack.controller.ts - line 108');
    const packs: any = await this.packService.findAllPacks();
    //console.log('Im at pack.controller.ts - line 111 - packs.length: ' + packs.total);
    return res.status(200).send({
      message: 'All Packs fetched successfully',
      total: packs.total,
      packs: packs.packs,
      data: packs.packs, // for RTQ-Query format handle data to frontend
 })
  }
  /**** end of function to get all Packs ******************************** */
  /*********** function to get a pack by id ********************************/
  @Get('get-single-pack/:id')
  async getpackById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response) {
    //console.log('Im at pack.controller.ts - line 126 - get-single-pack/:id' + id);
    const pack: any = await this.packService.findPackById(id);
    return res
      .status(200)
      .send({ message: 'Single Pack Fetched Successfully', data:pack })
  }
  /*********** end of function to get a Pack by id ***************************/
/*** Delete image function *******/
  @Post('delete-image')
  async deleteImagePack(@Res() res: Response , @Body('image') image: string,) {
    const ImageDeleted: any = await this.packService.deleteImagePack( image );
    return res.status(200).json({ message: ImageDeleted });
  }
  /*** End of  Delete image function **********************************/
  /*********** Delete pack function  *********************************/ 
  @Delete('delete-pack/:id')
  async deletePack(@Param('id') id: string, @Res() res: Response) {
    const deletedPack: any =  await this.packService.deletePack(id);
     //console.log('Estoy en pack.controller.ts - line 144 - deletePack: ' + deletedPack);
    return res.status(200).json({ message: deletedPack });

  }
  /******************** End of Delete pack function block **************/
  /*********** function to get a pack by id ********************************/
  @Get('/get-single-packbycode/:code')
  async getpackByCode(
    @Param('code') code: string,
    @Req() req: Request,
    @Res() res: Response) {
    //console.log('Im at pack.controller.ts - line 158 - /get-single-packbycode/:code' + code);
    const pack: any = await this.packService.findPackByCode(code);
    return res
      .status(200)
      .send({ message: 'Single Pack Fetched Successfully', data:pack })
  }
  /*********** end of function to get a Pack by id ***************************/

}
