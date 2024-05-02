import {Container, 
        Table,
        Thead,
        Tbody,
        Tr,
        Th,
        Td,
        Spinner,
        useToast,
        FormLabel,
        FormControl,
        Input,
        Button,
        VStack} 
        from "@chakra-ui/react"
import { useState, useEffect } from "react";
import axios from 'axios'
import {useQuery, useMutation}   from '@tanstack/react-query'
import {useFormik} from 'formik';
import usePostStore from "./zustand/usePostStore";

function App () {

const toast = useToast();

const handleEdit = (post) => {
  setEditMode(true);
  formik.setValues(post);
};

const axiosInstance = axios.create({
  baseURL:"https://jsonplaceholder.typicode.com"
});

const {setPosts, posts, deletePost, updatePost} = usePostStore();
const [editMode, setEditMode] = useState(false);
const { data, 
        isLoading: dataIsLoading} = useQuery({
  queryFn: async () => {
    const prodResponse =  await axiosInstance.get("/posts?_limit=10")
                          .then((res) => res.data);
      return prodResponse;
  },
    queryKey:["fetch.prod"]
})

useEffect(() => {
  if (data) setPosts(data);
}, [data])

const renderProdData = () => {
  return posts.map((prod) => {
    return(
      <Tr key={prod.id.toString()}>
        <Td>{prod.userId}</Td>
        <Td>{prod.id}</Td>
        <Td>{prod.title}</Td>
        <Td>{prod.body}</Td>
        <Td>
          <Button onClick={() => handleEdit(prod)}colorScheme="blue">
            Edit
          </Button>
        </Td>
        <Td>
          <Button onClick={() => confirmationDel(prod.id)}colorScheme="red">
            Delete
          </Button>
        </Td>
      </Tr>
    )
  })
}

const formik = useFormik({
  initialValues: {
    userId:"",
    id:"",
    title:"",
    body:"",
  },
    onSubmit: () => {
      if (editMode) {
        const { userId, id, title, body } = formik.values;
        updatePost({ userId, id, title, body });
        toast({
          title: "Data Updated",
          status: "success",
        });
      } else {
      const {userId, id, title, body} = formik.values;
        createProd({
          userId,
          id,
          title,
          body
        });
        formik.setFieldValue("userId", "")
        formik.setFieldValue("id", "")
        formik.setFieldValue("title", "")
        formik.setFieldValue("body", "")

        setPosts([...posts, {userId, id, title, body}])

        toast ({
          title: "Data Added",
          status: "success",
        })
      }
        setEditMode(false);
        formik.resetForm();
    }
});

const {mutate: createProd} = useMutation({
  mutationFn: async (body) => {
    const prodResponse = await axiosInstance.post("/posts", body)

    return prodResponse;
  },
})

const handleFormInput = (e) => {
  formik.setFieldValue(e.target.name, e.target.value)
}

const {mutate: deleteProd} = useMutation({
  mutationFn: async (id) => {
    const prodResponse = await axiosInstance.delete("/posts/${id}")
    deletePost(id)
    return prodResponse;
  },
})

const confirmationDel = (prodId) => {
  const shouldDel = confirm("Are you sure you wanna delete the data?")
    if (shouldDel){
      deletePost(prodId)
      toast ({
        title: "Data Deleted",
        status: "info",
      })
    }
}

const { mutate: updateProd } = useMutation({
  mutationFn: async (body) => {
    await axiosInstance.put(`/posts/${body.id}`, body);
    updatePost(body);
  },
});

  return (
    <>
      <Container>
        <Table>
          <Thead>
            <Tr>
              <Th>userId</Th>
              <Th>id</Th>
              <Th>title</Th>
              <Th>body</Th>
              <Th colSpan={2}>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {renderProdData()}
            {dataIsLoading ? <Tr><Td><Spinner size="xl"/></Td></Tr> : null}
          </Tbody>
        </Table>
        <form onSubmit={formik.handleSubmit} >
          <VStack spacing = "4">
          <FormControl>
            <FormLabel>User ID</FormLabel>
            <Input  onChange={handleFormInput} 
                    name="userId"
                    value={formik.values.userId}/>
          </FormControl>
          <FormControl>
            <FormLabel>ID</FormLabel>
            <Input  onChange={handleFormInput} 
                    name="id"
                    value={formik.values.id}/>
          </FormControl>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input  onChange={handleFormInput} 
                    name="title"
                    value={formik.values.title}/>
          </FormControl>
          <FormControl>
            <FormLabel>Body</FormLabel>
            <Input  onChange={handleFormInput} 
                    name="body"
                    value={formik.values.body}/>
          </FormControl>
          <Button type="submit">{editMode ? 'Update' : 'Submit Data'}</Button>
          </VStack>
        </form>
      </Container>
      
    </>
  )
}

export default App
