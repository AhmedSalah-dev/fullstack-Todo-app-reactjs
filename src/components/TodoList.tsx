import Button from "./ui/Button";
import useCustomQuery from "../hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { useState } from "react";
import Textarea from "./ui/Textarea";
import { ChangeEvent,FormEvent } from "react";
import axiosInstance from "../config/axios.config";
import TodoSkeleton from "./ui/TodoSkeleton";
import { faker } from '@faker-js/faker';
import { ITodo } from "../interfaces";

const TodoList = () => {
  
const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const [queryVersion, setQueryVersion] = useState(1)
const [isEditModalOpen,setIsEditModalOpen]= useState(false);
const [isUpdating,setIsUpdating]= useState(false);
const [isOpenConfirmModal,SetIsOpenConfirmModal]= useState(false);
const [isOpenAddModal,SetIsOpenAddModal]= useState(false);
const [todoToAdd,setTodoToAdd]= useState({
  
  title: "",
  description: "",
});
const [todoToEdit,setTodoToEdit]= useState<ITodo>({
  id: 0,
  title: "",
  description: "",
});

// ** Fetch data
const {isLoading, data} = useCustomQuery({
   queryKey: ['todoList',`${queryVersion}`],
   url: "/users/me?populate=todos",
   config: {
   headers: {
               Authorization: `Bearer ${userData?.jwt}`
            }
    }
  })
  

  // ** Handlers
  const onCloseAddModal = () => {
    setTodoToAdd({
      title: "",
      description: "",
    })
    SetIsOpenAddModal(false)
  };
  const onOpenAddModal = () => {
    SetIsOpenAddModal(true);

  }
  const onCloseEditModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    })
    setIsEditModalOpen(false)
  };
  const onOpenEditModal = (todo:ITodo) => {
    setTodoToEdit(todo)
    setIsEditModalOpen(true);

  }
  const closeConfirmModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    })
    SetIsOpenConfirmModal(false);
  };
  const openConfirmModal = (todo:ITodo) =>
     {
      setTodoToEdit(todo)
      SetIsOpenConfirmModal(true)
     };
  const onChangeAddTodoHandler = (evt:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const {value, name} = evt.target
      
      setTodoToAdd({
        ...todoToAdd,
        [name]: value
      })
  };
  const onChangeHandler = (evt:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const {value, name} = evt.target
      
      setTodoToEdit({
        ...todoToEdit,
        [name]: value
      })
  };

  const onSubmitRemoveTodo = async() => {
    try {
     const {status} = await axiosInstance.delete(`/todos/${todoToEdit.id}`, {
        headers : {
          Authorization: `Bearer ${userData?.jwt}`
        }
      })

      if (status===200) {
        closeConfirmModal()
        setQueryVersion(prev =>prev+1)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const onSubmitEditTodo = async(evt:FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsUpdating(true);
    try {
     const{title, description}=todoToEdit
     const {status} = await axiosInstance.put(`/todos/${todoToEdit.id}`, {data: {title,description}} , {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`
     }
    }
  );

  if (status === 200) {
    onCloseEditModal();
    setQueryVersion(prev => prev+1)
  }
  
} catch (error) {
  console.log(error);
} finally {
  setIsUpdating(false);
}

  }
  const onSubmitAddTodo = async(evt:FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsUpdating(true);
    try {
     const{title, description}=todoToAdd
     const {status} = await axiosInstance.post(`/todos`, {data: {title,description,user:[userData.user.id]}} , {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`
     }
    }
  );

  if (status === 200) {
    onCloseAddModal();
    setQueryVersion(prev => prev+1)
  }
  
} catch (error) {
  console.log(error);
} finally {
  setIsUpdating(false);
}

  }
  
  const onGenerateTodos = async() => {
      // ** 100 record
      for(let i=10; i<100; i++) {
        
        try {
        
         const {data}= await axiosInstance.post(`/todos`, {data: {title: faker.word.words(5),description: faker.lorem.paragraph(2),user:[userData.user.id]}} , {
           headers: {
             Authorization: `Bearer ${userData?.jwt}`
          }
         }
       );
     
       console.log(data)
       
     } catch (error) {
       console.log(error);
     } 
      }


  }

 // ** skeleton
  if (isLoading) return (
    <div className="space-y-1 p-3">
      {Array.from({length:3}, (_,idx) => (
        <TodoSkeleton key={idx} />
      ))}
    </div>

  )

  return (
    <div className="space-y-1">
      <div className="w-fit mx-auto my-10">
        {isLoading?(
          <div className="flex items-center justify-end w-full space-x-3 ">
            <div className="h-9 bg-gray-400 rounded-md dark:bg-gray-700 w-32"></div>
            <div className="h-9 bg-gray-400 rounded-md dark:bg-gray-700 w-32"></div>
          </div>
        ):(
        <div className="flex items-center justify-end w-full space-x-3 ">
          <Button size={"sm"} onClick={onOpenAddModal}>Post New Todo</Button>
          <Button variant={"outline"} size={"sm"} onClick={onGenerateTodos}>Generate Todo</Button>
        </div>
        )}
        </div>
      {data.todos.length ?
        data.todos.map((todo:ITodo) => (
          <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md
      even:bg-gray-100">
        <p className="w-full font-semibold">{todo.id}- {todo.title}</p>
        <div className="flex items-center justify-end w-full space-x-3">
          <Button size={"sm"} onClick={()=>onOpenEditModal(todo)}>Edit</Button>
          <Button variant={"danger"} size={"sm"}
           onClick={()=>{openConfirmModal(todo)}}
          >
            Remove
          </Button>
        </div>
      </div>
        )):
          (
            <h3>No todos yet!</h3>
          )}
          {/* Add Todo Modal */}
             <Modal 
            isOpen={isOpenAddModal} 
            closeModal={onCloseAddModal} 
            title="Add New Todo">
            <form onSubmit={onSubmitAddTodo}>
              <Input name="title" value={todoToAdd.title} onChange={onChangeAddTodoHandler}/>
              <Textarea name="description" value={todoToAdd.description} onChange={onChangeAddTodoHandler}/>
              <div className="mt-4 flex space-x-5">
                  <Button className="bg-indigo-700 hover:bg-indigo-800" isLoading={isUpdating} >Done</Button>
                  <Button type="button" variant={"cancel"} onClick={onCloseAddModal}>Cancel</Button>
              </div>
            </form>
          </Modal> 

          {/*Edit Modal */}
          <Modal 
            isOpen={isEditModalOpen} 
            closeModal={onCloseEditModal} 
            title="Edit this todo">
            <form onSubmit={onSubmitEditTodo}>
              <Input name="title" value={todoToEdit.title} onChange={onChangeHandler}/>
              <Textarea name="description" value={todoToEdit.description} onChange={onChangeHandler}/>
              <div className="mt-4 flex space-x-5">
                  <Button className="bg-indigo-700 hover:bg-indigo-800" isLoading={isUpdating} >Update</Button>
                  <Button type="button" variant={"cancel"} onClick={onCloseEditModal}>Cancel</Button>
              </div>
            </form>
          </Modal> 

          {/* Delete Modal */}
          <Modal 
            isOpen={isOpenConfirmModal} 
            closeModal={closeConfirmModal} 
            title="Are you sure you want to remove this todo from your Store?"
            description="Deleting this Todo will remove it from your inventory. Any associated data, sales history, and other related information
            will be permanently deleted. please make sure this is the intended action."
          >       
            <div className=" flex items-center space-x-4 mt-4 ">
             <Button variant={"danger"} onClick={onSubmitRemoveTodo}>Yes, remove</Button>
             <Button type="button" variant={"cancel"} onClick={closeConfirmModal}>Cancel</Button>
            </div>
           
          </Modal> 
    </div>
  );
};
    
export default TodoList;
