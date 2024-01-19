import {Route, Routes} from "react-router-dom";
import ContainerDefault from "./components/containers/default/ContainerDefault.tsx";
import CategoriesListPage from "./components/categories/list/CategoriesListPage.tsx";
import CategoryUpdatePage from "./components/categories/update/CategoryUpdatePage.tsx";
import CategoryCreatePage from "./components/categories/create/CategoryCreatePage.tsx";
import NoMatch from "./components/containers/pages/NoMatch.tsx";
import React from "react";
import RegisterPage from "./components/auth/register/RegisterPage.tsx";

const App: React.FC = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<ContainerDefault />}>
                    <Route index element={<CategoriesListPage />} />
                    <Route path={'create'} element={<CategoryCreatePage />} />
                    <Route path="update/:categoryId" element={<CategoryUpdatePage />} />
                    <Route path={'register'} element={<RegisterPage />} />

                    <Route path="*" element={<NoMatch/>} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
