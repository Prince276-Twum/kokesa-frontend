import React, { use } from "react";

interface Props {
  params: Promise<{ businessStep: string }>;
}
function Page({ params }: Props) {
  const { businessStep } = use(params);

  console.log(businessStep);
  return <div>page</div>;
}

export default Page;
