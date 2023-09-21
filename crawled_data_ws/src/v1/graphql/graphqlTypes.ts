

namespace graphqlTypes
{

    export type WebPage = {
        identifier: Number
        label: String
        url: String
        regexp: String
        tags: String[]
        active: Boolean
    }

    export type Node = {
        title?: String
        url: String
        crawlTime?: String
        links: Node[]
        owner: WebPage
    }

}

export default graphqlTypes;