import { Module } from "@nestjs/common";
import { filesController } from "./file.controller";
import { filesService } from "./file.service";



@Module({
    controllers:[filesController],
    providers:[filesService],
    exports:[filesService]
})
export class filesModule{}