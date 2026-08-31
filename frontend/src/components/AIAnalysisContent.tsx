import ReactMarkdown from "react-markdown";


type AIAnalysisContentProps = {
  analysis: string;
};


function AIAnalysisContent({
  analysis,
}: AIAnalysisContentProps) {

  return (

    <div className="ai-markdown">

      <ReactMarkdown>
        {analysis}
      </ReactMarkdown>

    </div>

  );

}


export default AIAnalysisContent;