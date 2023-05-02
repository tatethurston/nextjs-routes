import { route } from "nextjs-routes";

export default () => <div>Index: {route({ pathname: "/" })}</div>;
