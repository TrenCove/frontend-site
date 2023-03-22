import { useRouter } from 'next/router'

export default function Item(){
    const router = useRouter()
    const { id } = router.query;

    return(
        <div>{id}</div>
    )
}