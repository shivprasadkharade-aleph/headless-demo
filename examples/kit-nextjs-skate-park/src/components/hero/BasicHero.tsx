import React, { JSX } from 'react';
import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import {
  Text,
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
} from '@sitecore-content-sdk/nextjs';
interface BasicHeroProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

type ContentBlockProps = BasicHeroProps & {
  fields: {
    Title: Field<string>;
    SubText: Field<string>;
    Image: ImageField
    Link: LinkField
  };
};

export const Default = (props: ContentBlockProps): JSX.Element => {

  return (

    <div className="container-wrapper"><div className="">
      <section className="hero">
        <div className="hero__media">
          <ContentSdkImage className="hero__img" field={props.fields.Image} />
          <div className="hero__overlay"></div>
        </div>

        <div className="hero__content">
          <Text tag='h1' className="hero__title hero__padding" field={props.fields.Title}></Text>
          {/* <h1 className="hero__title hero__padding">{TitleText}</h1> */}

          <p className="hero__subtitle">
            <Text field={props.fields.SubText}/>
          </p>

          <div className="hero__cta">
            <a className='btn' href={props.fields.Link.value.href} target={props.fields.Link.value.target}>{props.fields.Link.value.text}</a>
            
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};
