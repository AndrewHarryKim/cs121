package ir.assignments.two.a;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;

/**
 * A collection of utility methods for text processing.
 */
public class Utilities {
	/**
	 * Reads the input text file and splits it into alphanumeric tokens.
	 * Returns an ArrayList of these tokens, ordered according to their
	 * occurrence in the original text file.
	 * 
	 * Non-alphanumeric characters delineate tokens, and are discarded.
	 *
	 * Words are also normalized to lower case. 
	 * 
	 * Example:
	 * 
	 * Given this input string
	 * "An input string, this is! (or is it?)"
	 * 
	 * The output list of strings should be
	 * ["an", "input", "string", "this", "is", "or", "is", "it"]
	 * 
	 * @param input The file to read in and tokenize.
	 * @return The list of tokens (words) from the input file, ordered by occurrence.
	 */
	public static ArrayList<String> tokenizeFile(File input) {
		String out="";
		try {
	       
	         Scanner scanner = new Scanner(input);
	         while (scanner.hasNextLine()) 
	           out=out+(scanner.nextLine())+"\n";
	         
	         scanner.close();
	       } catch (FileNotFoundException e) {
	         e.printStackTrace();
	       }
		return tokenizeFile(out);
		
	}
	public static ArrayList<String> tokenizeFile(String input) {
		
		
		//String[] result = input.toLowerCase().split("\\W");
		//ArrayList<String> output = new ArrayList<String>(Arrays.asList(result));
		return new ArrayList<String>(Arrays.asList(input.toLowerCase().split("[^\\w']+" )));
	}
	/**
	 * Takes a list of {@link Frequency}s and prints it to standard out. It also
	 * prints out the total number of items, and the total number of unique items.
	 * 
	 * Example one:
	 * 
	 * Given the input list of word frequencies
	 * ["sentence:2", "the:1", "this:1", "repeats:1",  "word:1"]
	 * 
	 * The following should be printed to standard out
	 * 
	 * Total item count: 6
	 * Unique item count: 5
	 * 
	 * sentence	2
	 * the		1
	 * this		1
	 * repeats	1
	 * word		1
	 * 
	 * 
	 * Example two:
	 * 
	 * Given the input list of 2-gram frequencies
	 * ["you think:2", "how you:1", "know how:1", "think you:1", "you know:1"]
	 * 
	 * The following should be printed to standard out
	 * 
	 * Total 2-gram count: 6
	 * Unique 2-gram count: 5
	 * 
	 * you think	2
	 * how you		1
	 * know how		1
	 * think you	1
	 * you know		1
	 * 
	 * @param frequencies A list of frequencies.
	 */
	public static void printFrequencies(List<Frequency> frequencies) {
		String out = "\n";
		int total=0;
		int unique=0;
		Iterator<Frequency> it = frequencies.iterator();
		
		while(it.hasNext())
		{
			Frequency tmp=it.next();
			++unique;
			total+=tmp.getFrequency();
			out=out+"\n"+String.format("%-20s",tmp.getText())+tmp.getFrequency();
		}
		
		out="Total 2-gram count: "+total+"\nUnique 2-gram count: "+unique+out;
		System.out.println(out);
		
	}
}
