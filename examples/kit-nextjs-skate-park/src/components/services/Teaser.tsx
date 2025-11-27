import React, { JSX } from 'react';
import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import {
  Text,
  Field,
  ImageField,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';

interface ComponentDataChildItem {
  fields: {
    Title: Field<string>;
    Text: Field<string>;
    Image: ImageField;
  };
}

interface TeaserProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}
type ContentBlockProps = TeaserProps & {
  fields: {
    Title: Field<string>;
    Subtitle: Field<string>;
    Cards: ComponentDataChildItem[]
  };
};

export const Default = (props: ContentBlockProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  console.log('Teaser props', props.fields);
  return (

    <div className={`component ${props.params.styles}`} id={id ? id : undefined}>
      <div className="">
        <section className="ezy__service14 light">
          <div className="">
            <div className="row justify-content-center mb-4 mb-md-5">
              <div className="col-lg-6 text-center" style={{
                textAlign: "center", // horizontal centering
                marginLeft: "auto",
                marginRight: "auto", // center the div itself if needed
              }}>
                <Text tag='h2' className="ezy__service14-heading mb-4" field={props.fields.Title} />
                <Text tag='p' className="ezy__service14-sub-heading mb-0" field={props.fields.Subtitle} />
              </div>
            </div>
            <div className="row justify-content-center text-center">
              {props.fields.Cards.map((card, index) => {
                const { Image, Title, Text } = card.fields;
                return (
                  <div key={index} className="col-sm-6 col-md-4 mt-3 mt-sm-4">
                    <div
                      className="ezy__service14-card"
                      style={{ backgroundImage: `url('${Image.value?.src}')` }}
                    >
                      <div className="ezy__service14-popup-card p-3 p-lg-5">
                        <ContentSdkText tag='h4' className="ezy__service14-title fs-4 mb-3" field={card.fields.Title} />
                        <ContentSdkText tag='p' className="ezy__service14-content mb-0" field={card.fields.Text} />                     </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
