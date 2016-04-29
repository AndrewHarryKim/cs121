package ir.assignment.three.c;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import ir.assignments.two.a.Frequency;
import ir.assignments.two.b.WordFrequencyCounter;

public class SubDomain {
	
	public static ArrayList<Frequency> listSubdomains(ArrayList<String>urls)
	{
		
		ArrayList<String> subDomains=new ArrayList<String>();
		for(String entry:urls)
		{
			try {
				//URL url = new URL(entry);
				String[] out=new URL(entry).getHost().toString().split("\\.");
				
				StringBuilder stringOutput=new StringBuilder();
				/* This is making the assumption that the url is structured as...
				 * [extension.] x n + [domain name] +[TLD]
				 * So the output for
				 * drive.google.com => drive
				 * http://pages.cs.wisc.edu/ => pages.cs
				 */
			
				
				for(int i=0;i<out.length-2;++i)
				{

					/*
					 * If you wanted to include the actual domain, you would make this
					 * length-1 instead.
					 */
					
					if(i>0)
						stringOutput.append('.');
					stringOutput.append(out[i]);
				}
				if(out.length-2>0) 
					/* The assumption made is that a url with no 
					 * sub domain will not be counted in the list
					 * To make it so it will count all urls with no subdomains...
					 * Change 'out.length-2>0' to 'out.length-2>=0'
					 */
				
					subDomains.add(stringOutput.toString());
			} catch (MalformedURLException e) {
				/* 
				 * Note: The input must be well formulated and 
				 * include the http, ftp, https protocol in the URL
				 */
				
				e.printStackTrace();
			}
		}
		return (ArrayList<Frequency>) WordFrequencyCounter.computeWordFrequencies(subDomains);
		
	}
	public static void main(String[] args)
	{
		ArrayList<String>urlList= new ArrayList<String>();
		urlList.add("https://sites.google.com/site/bozhenabidyuk/teaching/winter-2016/cs-121-in4matx141");
		urlList.add("http://kdd.ics.uci.edu/databases/movies/data/actors.html");
		System.out.println(listSubdomains(urlList));
	}
	
}
