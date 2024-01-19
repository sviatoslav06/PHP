import {IUploadedFile} from "../../../interfaces/forms";

export interface IRegister {
    name: string;
    latName: string;
    phone: string;
    email: string;
    image: string|undefined;
    password: string;
    password_confirmation: string;
}

export interface IRegisterForm{
    name: string;
    latName: string;
    phone: string;
    email: string;
    image: IUploadedFile|null;
    password: string;
    password_confirmation: string;
}
