import React, {useEffect, useState} from "react";
import {ICategoryItem} from "./types.ts";
import {ColumnsType} from "antd/es/table";
import {Button, Table} from "antd";
import http_common from "../../../http_common.ts";
import {APP_ENV} from "../../../env";
import {Link} from "react-router-dom";
import ButtonGroup from "antd/es/button/button-group";

const CategoriesListPage: React.FC = () => {
    const [list, setList] = useState<ICategoryItem[]>(
    );
    const [renderNeeded, setRenderNeeded] = useState(true);

    const imagePath = `${APP_ENV.BASE_URL}/upload/150_`;

    const deleteCategory = async (id: number) => {
        await http_common.delete(`/api/categories/${id}`);
        setRenderNeeded(true);
    };

    const columns : ColumnsType<ICategoryItem> = [
        {
            title: "#",
            dataIndex: "id"
        },
        {
            title: "Назва",
            dataIndex: "name"
        },
        {
            title: "Фото",
            dataIndex: "image",
            render: (imageName: string) => {
                return (
                    <img src={`${imagePath}${imageName}`} alt="фото" />
                )
            }
        },
        {
            title: "Дії",
            dataIndex: "id",
            render: (id: number) => {
                return (
                    <>
                        <ButtonGroup>
                            <Button type="primary" danger onClick={() => deleteCategory(id)}>
                                Видалити категорію
                            </Button>
                            <Button type={'primary'} href={`/update/${id}`} >
                                Редагувати категорію
                            </Button>
                        </ButtonGroup>
                    </>
                );
            }
        }
    ];

    useEffect(() => {
        if (!renderNeeded) return;
        (async () => {
            const response = await http_common.get("/api/categories");
            setList(response.data);
            setRenderNeeded(false);
        })(); //переданий метод запуститься лише при першому рендері
    }, [renderNeeded]); //переданий метод запускатиметься при зміні renderNeeded і при першому рендері

    return (
        <>
            <h1>Список категорій</h1>
            <Link to={'/create'}>
                <Button type={'primary'}>
                    Додати категорію
                </Button>
            </Link>
            <Table columns={columns} rowKey={"id"} dataSource={list} size={"middle"}/>
        </>
    );
}

export default CategoriesListPage;
