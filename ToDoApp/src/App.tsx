import React, { useState, useEffect } from "react"
import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql"
import { generateClient } from "aws-amplify/api"
import { uploadData } from "aws-amplify/storage"
import { listTodos } from "../../src/graphql/queries"
import { createTodo, updateTodo, deleteTodo } from "../../src/graphql/mutations"
import { ListTodosQuery, Todo } from "../../src//API"
import { getCurrentUser, signOut } from "aws-amplify/auth"
import { MdEdit } from "react-icons/md"
import { MdDelete } from "react-icons/md"
import "@aws-amplify/ui-react/styles.css"
const client = generateClient()

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [todoName, setTodoName] = useState<string>("")
  const [todoDescription, setTodoDescription] = useState<string>("")
  const [userDetails, setUserDetails] = useState<string | undefined>()
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [todoImage, setTodoImage] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    setTodoImage(file || null)
  }

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser()
      if (user) {
        setUserDetails(user.userId)
      }
    }
    getUser()
  }, [])

  const fetchTodos = async () => {
    try {
      const todoData = (await client.graphql(
        graphqlOperation(listTodos, {
          filter: {
            owner: {
              eq: userDetails,
            },
          },
        })
      )) as GraphQLResult<ListTodosQuery>
      console.log(todoData)
      const todos = todoData.data?.listTodos?.items as Todo[]
      setTodos(todos)
    } catch (error) {
      console.error("Error fetching todos", error)
    }
  }
  useEffect(() => {
    if (userDetails) {
      fetchTodos()
    }
  }, [userDetails])

  const handleAddTodo = async () => {
    if (!todoName) return

    let imageUrl: string | null = null

    if (todoImage) {
      try {
        const uploadResult = await uploadData({
          path: `uploads/${todoImage.name}`,
          data: todoImage,
        }).result
        imageUrl = uploadResult.path
      } catch (error) {
        console.error("Error uploading file:", error)
      }
    }

    const newTodo = {
      name: todoName,
      description: todoDescription,
      image: imageUrl,
      owner: userDetails,
    }
    try {
      const result = (await client.graphql(
        graphqlOperation(createTodo, { input: newTodo })
      )) as GraphQLResult<{ createTodo: Todo }>
      setTodos([...todos, result.data!.createTodo])
      setTodoName("")
      setTodoDescription("")
    } catch (error) {
      console.error("Error creating todo", error)
    }
  }

  const handleUpdateTodo = async () => {
    if (!editingTodo) return
    const updatedTodo = {
      id: editingTodo.id,
      name: todoName,
      description: todoDescription,
    }
    try {
      const result = (await client.graphql(
        graphqlOperation(updateTodo, { input: updatedTodo })
      )) as GraphQLResult<{ updateTodo: Todo }>
      setTodos(
        todos.map((todo) =>
          todo.id === editingTodo.id ? result.data!.updateTodo : todo
        )
      )
      setEditingTodo(null)
      setTodoName("")
      setTodoDescription("")
    } catch (error) {
      console.error("Error updating todo", error)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      ;(await client.graphql(
        graphqlOperation(deleteTodo, { input: { id } })
      )) as GraphQLResult<{ deleteTodo: Todo }>
      setTodos(todos.filter((todo) => todo.id !== id))
    } catch (error) {
      console.error("Error deleting todo", error)
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo)
    setTodoName(todo.name || "")
    setTodoDescription(todo.description || "")
  }

  return (
    <div className="flex justify-center w-full">
      <div className="w-1/4 mt-8">
        <div className="flex flex-col w-full">
          <input
            type="text"
            placeholder="Todo Name"
            value={todoName}
            onChange={(e) => setTodoName(e.target.value)}
            className="w-full px-4 py-2 border-[#9e78cf] border rounded-lg mb-4"
          />
          <textarea
            placeholder="Todo Description"
            value={todoDescription}
            onChange={(e) => setTodoDescription(e.target.value)}
            className="w-full px-4 py-2 border-[#9e78cf] border rounded-lg mb-4"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border-[#9e78cf] border rounded-lg mb-4"
          />
          <button
            onClick={editingTodo ? handleUpdateTodo : handleAddTodo}
            className="bg-[#9e78cf] text-white hover:bg-[#3E1671] hover:border hover:border-[#3E1671]"
          >
            {editingTodo ? "Update Todo" : "Add Todo"}
          </button>
          {editingTodo && (
            <button
              onClick={() => {
                setEditingTodo(null)
                setTodoName("")
                setTodoDescription("")
              }}
              className="mt-4"
            >
              Cancel
            </button>
          )}
        </div>
        <div className="mt-5">
          {todos &&
            todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-[#15101c] mb-4 px-4 py-2 rounded-2xl relative group"
              >
                <h2 className="text-2xl text-[#9E78CF] font-bold my-3">
                  {todo.name}
                </h2>
                <p className="text-[#9E78CF] text-md mb-3">
                  {todo.description}
                </p>
                <div className="flex justify-center items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 bg-[#15101c] bg-opacity-75 rounded-2xl">
                  <button
                    onClick={() => startEditing(todo)}
                    className="bg-[#9e78cf] text-white hover:bg-[#3E1671] hover:border hover:border-[#3E1671]"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id!)}
                    className="bg-[#9e78cf] text-white hover:bg-[#3E1671] hover:border hover:border-[#3E1671]"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <button
        onClick={async () => await signOut()}
        className="bg-[#9e78cf] text-white hover:bg-[#3E1671] hover:border hover:border-[#3E1671] fixed left-10 bottom-6"
      >
        Sign Out
      </button>
    </div>
  )
}

export default App
