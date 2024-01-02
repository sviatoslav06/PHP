import {Button, Divider, Form, Input, Upload, message, Alert} from "antd";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import type {UploadChangeParam} from 'antd/es/upload';
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface';
import {ICategoryCreate} from "./types.ts";
import http_common from "../../../http_common.ts";

const CategoryCreatePage = () => {

    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);


    const onFinish = async (values: any) => { //асинхронна функція яка буде спрацьовувати коли нажата кнопка ДОДАТИ
        console.log('Success:', values); // вивід категорії, яка була додана у консоль
        console.log('file:', file); // вивід файлу(фото) в консоль
        if(file==null) { // якщо фото не вибане то вивести на екран повідомлення
            setErrorMessage("Оберіть фото!");
            return;
        }
        const model : ICategoryCreate = { // створення моделі категорії для подальшої обробки
            name: values.name,
            image: file
        };
        try {
            await http_common.post("/api/categories/create", model,{ // виконання POST запиту
                headers: {
                    "Content-Type": "multipart/form-data" // формат відправлення
                }
            });
            navigate("/"); // перехід на головну сторінку
        }
        catch (ex) {
            message.error('Помилка створення категорії!');
        }
    }

    const onFinishFailed = (errorInfo: any) => { // виведення помилки якщо вона є
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        name?: string;
    };

    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };



    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => { // створення функції яка є обробником для завантаження файлу(картинки)
        if (info.file.status === 'uploading') { // якщо функції передано значення 'uploading', то встановлюємо значення змінної loading на true
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') { // функції передано значення 'done'
            const file = info.file.originFileObj as File; // отримуємо об'єкт який завантажено
            setLoading(false); // виставляємо змінній loading значення false
            setFile(file); // записуємо у змінну file фото, яке було завантажено
            setErrorMessage(""); // занулюємо змінну errorMessage
        }
    };

    const uploadButton = ( // створення вигляду кнопки коли завантажеється фото
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    const beforeUpload = (file: RcFile) => {
        const isImage = /^image\/\w+/.test(file.type); // змінна яка визначає правильність формату картинки
        if (!isImage) { // якщо картинка вибрана неправильно то виводиться повідомлення
            message.error('Оберіть файл зображення!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10; // змінна яка визначає чи розмір картинки не перевищує 2мб
        if (!isLt2M) {
            message.error('Розмір файлу не повинен перевищувать 10MB!');
        }
        console.log("is select", isImage && isLt2M); // виведення у консоль результатів двох перевірок
        return isImage && isLt2M;
    };

    return (
        <>
            <Divider style={customDividerStyle}>Додати категорію</Divider>
            {errorMessage && <Alert message={errorMessage} style={{marginBottom: "20px"}} type="error" />} // блок в який буде виводитись помилка
            <Form // створення форми та встановлення для неї дефолтних значнь
                name="basic"
                style={{maxWidth: 1000}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType> // створення поля форми для заповнення назви категорії
                    label="Назва"
                    name="name"
                    rules={[{required: true, message: 'Вкажіть назву категорії!'}]} // встановлення валідації на поле name
                >
                    <Input/>
                </Form.Item>


                <Upload // створення поля для завантаження фото та задання йому дефолтних значень
                    name="avatar" // ім'я поля
                    listType="picture-card" // стиль відображення завантажених файлів
                    className="avatar-uploader" // додаємо клас
                    showUploadList={false} // приховуємо список завантажених файлів
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188" // адреса на яку буде відправлене зображення
                    beforeUpload={beforeUpload} // вказуємо функцію, яка буде виконуватись перед завантаженням файлу
                    onChange={handleChange} // вказуємо функцію, яка буде викликана при зміні завантажуваного файлу
                    accept={"image/*"} // вказуємо тип файлів, які можуть бути вибрані
                >
                    {file ? <img src={URL.createObjectURL(file)} alt="avatar" style={{width: '100%'}}/> : uploadButton} // якщо зображення вибрано то воно показується, якщо ні то відображається кнопка завантаження
                </Upload>

                <Form.Item wrapperCol={{offset: 8, span: 16}}> // створення кнопки, яка буде віжповідати за додавання категорії
                    <Button type="primary" htmlType="submit">
                        Додати
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default CategoryCreatePage;
