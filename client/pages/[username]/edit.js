import { useRouter } from 'next/router'

const Edit = () => {
  const router = useRouter()
  const { username } = router.query;
  return <p>Edit: {username}</p>
}

export default Edit;
