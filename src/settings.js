import ForgeUI, {AdminPage, render, Text} from '@forge/ui';

const ExampleAdminPage = () => {
    return (
        <AdminPage>
            <Text>Hello, world!</Text>
        </AdminPage>
    );
};
export const renderAdminPage = render(
    <ExampleAdminPage />
);