export class Project {
    title: string;
    description: string;
    githubProjectLink: string;
    authorName: string;
    technologies: Array<string>;
    appliedUsers: Array<string>;
    comments: Array<object>;
    requiredRoles: Array<string>;

    constructor() {
        this.title = '';
        this.description = '';
        this.githubProjectLink = '';
        this.authorName = '';
        this.technologies = [];
        this.appliedUsers = [];
        this.requiredRoles = [];
        this.comments = [];
    }
}