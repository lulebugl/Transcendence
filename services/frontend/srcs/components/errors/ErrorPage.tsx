import { Layout } from "../layout";
import { Link } from "react-router";
import { Button } from "../ui/Button";

export function ErrorPage({ ...props }: React.PropsWithChildren) {
  return (
    <Layout>
      <div className="h-[90vh] flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8 max-w-md -mt-16">
		  {props.children}
          <Button
		    asChild={true}
			>
            <Link to="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
