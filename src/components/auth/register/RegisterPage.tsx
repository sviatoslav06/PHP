import {Button, Divider, Form, Input, message, Alert, UploadFile, UploadProps, Modal, Upload} from "antd";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import http_common from "../../../http_common.ts";
import {IRegister, IRegisterForm} from "./types.ts";
import {RcFile} from "antd/es/upload";
import {PlusOutlined} from "@ant-design/icons";
import {imageConverter} from "../../../interfaces/forms";

const RegisterPage = () => {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [file, setFile] = useState<UploadFile | null>();
    const onFinish = async (values: IRegisterForm) => {
        const model : IRegister = {
            ...values,
            image: values.image?.thumbUrl
        };
        console.log("Register model", model);

        try {
            const user = await http_common.post("/api/register", model);
            console.log("User create new", user);
            navigate("/");
        }
        catch (ex) {
            setErrorMessage("Something went wrong");
            message.error('Error registration!');
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };


    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = URL.createObjectURL(file.originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    }
    const handleChange: UploadProps['onChange'] = ({fileList: newFile}) => {
        const newFileList = newFile.slice(-1);
        setFile(newFileList[0]);
    };


    return (
        <>
            <Divider style={customDividerStyle}>Реєстрація</Divider>
            {errorMessage && <Alert message={errorMessage} style={{marginBottom: "20px"}} type="error" />}
            <Form
                name="basic"
                style={{maxWidth: 1000}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{required: true, message: "Enter name!"}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Surname"
                    name="lastName"
                    rules={[{required: true, message: "Enter surname!"}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    htmlFor="phone"
                    rules={[
                        {required: true, message: 'This input is required!'},
                        {min: 11, message: 'Phone must have at least 11 symbols!'}
                    ]}
                >
                    <Input autoComplete="phone" id={"phone"}/>
                </Form.Item>

                <Form.Item
                    label="Image"
                    name="image"
                    getValueFromEvent={imageConverter}
                >
                    <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        listType="picture-card"
                        onChange={handleChange}
                        onPreview={handlePreview}
                        accept="image/*"
                    >
                        {file ? null :
                            (
                                <div>
                                    <PlusOutlined/>
                                    <div style={{marginTop: 8}}>Обрати фото</div>
                                </div>)
                        }
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="E-mail"
                    name="email"
                    htmlFor="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'E-mail is not valid!',
                        },
                        {required: true, message: 'This input is required!'},
                        {min: 2, message: 'E-mail must have minimum 2 symbols!'}
                    ]}
                >
                    <Input autoComplete="email" id={"email"}/>
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    htmlFor={"password"}
                    rules={[
                        {required: true, message: 'Enter Your password!',},
                        {min: 6, message: 'Password must have minimum 6 symbols!',},
                    ]}
                    hasFeedback
                >
                    <Input.Password id={"password"}/>
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    htmlFor={"confirm"}
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please, confirm your password!',
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password id={"confirm"}/>
                </Form.Item>

                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt={"Selected photo"} style={{width: "100%"}} src={previewImage} />
                </Modal>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Реєструватися
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default RegisterPage;
