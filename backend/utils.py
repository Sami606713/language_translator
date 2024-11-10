from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
from dotenv import load_dotenv
load_dotenv()
#========================================================================================#
# This is the main class for language translation
class Language_Translation:
    def __init__(self,text,target_language) -> None:
        self.text=text
        self.target_language=target_language

    def _load_llm(self):
        """
        This fun is responsible for managing the llm
        """
        try:
            # Api key
            g_api=os.environ["GROQ_API_KEY"]
            # set the llm
            llm = ChatGroq(
                model="mixtral-8x7b-32768",
                temperature=0.0,
                max_retries=2,
                api_key=g_api,
            )
            return llm

        except Exception as e:
            return str(e)

    def make_prompt_template(self):
        """
        This Fun is managing the prompt template.
        """
        try:
            # make a prompt template for the model for langauage translation
            prompt = PromptTemplate(
                template="""You are a skilled language translation expert.
                Please translate the given text directly into {target_language} and provide only the translated text as output, without including the original text.

                Input Text: "{input_text}"
                Translation:""",
                input_variables=["target_language", "input_text"],
            )
            return prompt
        except Exception as e:
            return str(e)


    def translate(self):
        """
        This Fun is responsible for translate the text into target language.
        """
        try:
            # load the llm
            llm=self._load_llm()

            # load the prompt template
            prompt=self.make_prompt_template()
            
            # Format the prompt with input values
            formatted_prompt = prompt.format(target_language=self.target_language, input_text=self.text)
            # print(formatted_prompt)
            
            response=llm.invoke(formatted_prompt)

            return response.content
        except Exception as e:
            return str(e)
        
if __name__=="__main__":
    text=input("Enter Text: ;")
    target_lang=input("Target Language: ")
    obj=Language_Translation(text=text,target_language=target_lang)
    response=obj.translate()
    print("Response: ",response)