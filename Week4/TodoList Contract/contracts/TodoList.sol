// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Todo {
    struct TodoItem {
        string title;
        string description;
        bool isDone;
    }

    TodoItem[] private todos;

    event TodoCreated(uint256 indexed index, string title);
    event TodoUpdated(uint256 indexed index, bool isDone);

    /**
     * @dev Creates a new to-do item.
     * @param _title Title of the to-do item.
     * @param _description Description of the to-do item.
     */
    function createTodo(string memory _title, string memory _description) external {
        TodoItem memory td = TodoItem({
            title: _title,
            description: _description,
            isDone: false
        });

        todos.push(td);

        emit TodoCreated(todos.length - 1, _title);
    }

    /**
     * @dev Returns all to-do items.
     * @return todos_ Array of all to-do items.
     */
    function getTodos() external view returns (TodoItem[] memory todos_) {
        todos_ = todos;
    }

    /**
     * @dev Returns a specific to-do item by index.
     * @param _index Index of the to-do item.
     * @return The requested to-do item.
     */
    function getTodo(uint256 _index) external view returns(TodoItem memory) {
        require(_index < todos.length, "index out of bound");
        return todos[_index];
    }

    /**
     * @dev Toggles the 'isDone' status of a to-do item.
     * @param _index Index of the to-do item.
     */
    function updateStatus(uint256 _index) external {
        require(_index < todos.length, "index out of bound");

        TodoItem storage td = todos[_index];
        td.isDone = !td.isDone;

        emit TodoUpdated(_index, td.isDone);
    }
}