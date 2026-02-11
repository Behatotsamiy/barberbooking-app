import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateBarberDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber("UZ")
    phone_number: string;
    @IsString()
    @IsNotEmpty()
    location: string;
    @IsString()
    @IsNotEmpty()
    bio: string;
    
}
