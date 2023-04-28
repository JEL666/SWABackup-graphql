import styled from '@emotion/styled';
import { useApolloClient, useMutation, gql } from '@apollo/client';
import Toggle from './Toggle';

const ListItem = styled.li`
    display: flex;
    width: 400px;
    height: 40px;
    align-items: center;
    padding: 0 8px;
    border-radius: 16px;
    background-color: white;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
    list-style: none;
    box-sizing: border-box;
`;

const Content = styled.span`
    flex: 1;
    margin-left: 8px;
    font-size: 14px;
    text-decoration: ${({ complete }) => (complete ? "line-through" : "none")};
`;

const DeleteButton = styled.button`
    width: 60px;
    height: 24px;
    margin-left: 8px;
    color: white;
    border-radius: 8px;
    border: none;
    background-color: red;
    cursor: pointer;
`;

const DELETE_TASK = gql`
    mutation DeleteTask($id: ID!) {
        deleteTask(id: $id) {
            data {
                id
            }
        }
    }
`;

const UPDATE_TASK = gql`
    mutation UpdateTask($id: ID!, $complete: Boolean) {
        updateTask(id: $id, data: { complete: $complete }) {
            data {
                id
            }
        }
    }
`;
export default function Task ({
    id,
    content,
    complete
}) {
    const client = useApolloClient();
    const [updateTask] = useMutation(UPDATE_TASK);
    const [deleteTask] = useMutation(DELETE_TASK);

    return (
        <ListItem>
            <Toggle
                on={complete}
                onChange={(e) => {
                    updateTask({ variables: { id, complete: e.target.checked }});
                    client.refetchQueries({ include: ["GetTasks"] });
                }}
            />
            <Content complete={complete}>{content}</Content>
            <DeleteButton
                onClick={() => {
                    deleteTask({ variables: { id: id }})
                    client.refetchQueries({ include: ["GetTasks"] })
                }}
            >
                    Delete
            </DeleteButton>

        </ListItem>
    )
}