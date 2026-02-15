import { IsAlpha, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class CreateClientDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    username: string;
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber("UZ")
    client_phonenumber: string;
    @IsString()
    @IsNotEmpty()
    photo: string;
    @IsNumber()
    @IsNotEmpty()
    price: number;

}
