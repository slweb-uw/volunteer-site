import { useRouter } from "next/router";

const Event = () => {
    const router = useRouter();
  const { location } = router.query; // current event id 



  // need to fetch from collection(location).doc(eventid)
  // event id is the current path bc event/[eventid]
  // need to get hte place location somehow 
  // unless every event id is unique?
  //

    return (
        <div>
            test
        </div>
    )
}