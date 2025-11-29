import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

type SectionHeaderProps = {
	title: string;
  } & (
	| { rightType?: "none" }
	| { rightType: "info"; info: string }
	| { rightType: "link"; linkText: string; linkTo: string }
  );
  
  export const SectionHeader = (props: SectionHeaderProps) => {
	const { title } = props;
  
	return (
	  <div className="flex items-center justify-between">
		<h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
		  {title}
		</h2>
  
		{props.rightType === "info" && (
		  <span className="text-[10px] font-mono text-muted-foreground/60">
			{props.info}
		  </span>
		)}
  
		{props.rightType === "link" && (
		  <Link
			to={props.linkTo}
			className="text-[10px] text-primary hover:underline transition-all hover:tracking-wider flex items-center gap-1"
			aria-label={`${props.linkText}`}
		  >
			{props.linkText}
			<ChevronRight className="w-3 h-3" />
		  </Link>
		)}
	  </div>
	);
  };
