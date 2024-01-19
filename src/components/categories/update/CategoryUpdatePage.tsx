import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import http_common from "../../../http_common.ts";
import {Alert, Button, Divider, Form, Input, message, Upload} from "antd";
import type {RcFile, UploadFile, UploadProps} from "antd/es/upload/interface";
import type {UploadChangeParam} from "antd/es/upload";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {ICategoryUpdate} from "./types.ts";
import {ICategoryItem} from "../list/types.ts";
import {APP_ENV} from "../../../env";

const CategoriesEditPage: React.FC = () => {
    const {categoryId} = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState<ICategoryItem | null>(null);
    const [form] = Form.useForm();

    const imagePath = `${APP_ENV.BASE_URL}/upload/150_`;

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        console.log('file:', file);
        const model: ICategoryUpdate = {
            id: category?.id ?? 0,
            name: values.name,
            image: file
        };
        try {
            await http_common.post(`/api/categories/edit/${categoryId}`, model, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate("/");
        } catch (ex) {
            message.error('Помилка редагування категорії!');
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        name?: string;
    };

    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            const file = info.file.originFileObj as File;
            setLoading(false);
            setFile(file);
            setErrorMessage("");
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    const beforeUpload = (file: RcFile) => {
        const isImage = /^image\/\w+/.test(file.type); //за допомогою регулярних виразів перевіряємо, чи завантажений файл є зображенням
        if (!isImage) {
            message.error('Оберіть файл зображення!');
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Розмір файлу не повинен перевищувать 10MB!');
        }
        console.log("is select", isImage && isLt10M);
        return isImage && isLt10M;
    };

    useEffect(() => {
        (async () => {
            const response = await http_common.get(`api/categories/${categoryId}`);
            setCategory(response.data);
        })();
    }, [categoryId]);

    useEffect(() =>
        form.setFieldValue('name', category?.name), [category, form]);

    return (
        <>
            <Divider style={customDividerStyle}>Редагувати категорію</Divider>
            {
                errorMessage && <Alert message={errorMessage} style={{marginBottom: "20px"}} type="error" /> //Якщо errorMessage не пусте, то воно буде виведене на екран
            }
            <Form
                form={form}
                name="basic"
                style={{maxWidth: 1000}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Назва"
                    name="name"
                    rules={[{required: true, message: 'Вкажіть назву категорії!'}]}
                >
                    <Input />
                </Form.Item>

                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    accept={"image/*"}
                >
                    {file
                        ? <img src={URL.createObjectURL(file)} alt="avatar" style={{width: '100%'}}/> //шлях до зображення - це тимчасово створена url із завантаженим файлом
                        : category
                            ? <img src={imagePath + category?.image} alt="avatar" style={{width: '100%'}}/>
                            : uploadButton}
                </Upload>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit" style={{margin: "10px"}}>
                        Редагувати
                    </Button>
                    <Button htmlType="button"
                            style={{margin: "10px"}}
                            onClick={(event) => {
                                event.preventDefault();
                                navigate('/');
                            }}>
                        Відмінити
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CategoriesEditPage;
