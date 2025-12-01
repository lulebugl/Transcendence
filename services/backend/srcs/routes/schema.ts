export const fields = {
	username: {
	  type: "string",
	  pattern: "^[a-zA-Z0-9]+$",
	  minLength: 3,
	  maxLength: 20,
	  description:
	  "Must be between 3 and 30 characters and can only contain letters and numbers",
	},
	
	password: {
	  type: "string",
	  minLength: 8,
	  maxLength: 128,
	  description:
	  "Must be at least 8 characters long",
	},

	alphanumeric: {
	  type: "string",
	  pattern: "^[a-zA-Z0-9]+$",
	},
	
	url: {
	  type: "string",
	  format: "uri",
	  maxLength: 500,
	},
  } as const;
